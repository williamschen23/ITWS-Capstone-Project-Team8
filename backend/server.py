import json
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import numpy as np
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()
from models import pointnet_cls
import os
import shutil
from worker import meta_path, start_worker, RAW_DIR, POINTCLOUD_DIR, write_meta, Job, job_queue

app = Flask(__name__)
CORS(app, supports_credentials=True)

# === Load model ===
MODEL_PATH = 'log/model.ckpt'
NUM_POINTS = 2048
NUM_CLASSES = 40

pointclouds_pl = tf.placeholder(tf.float32, shape=(1, NUM_POINTS, 3))
is_training_pl = tf.placeholder(tf.bool, shape=())
pred, _ = pointnet_cls.get_model(pointclouds_pl, is_training_pl)
pred_softmax = tf.nn.softmax(pred)

saver = tf.train.Saver()
sess = tf.Session()
saver.restore(sess, MODEL_PATH)

classes = [
    'airplane','bathtub','bed','bench','bookshelf','bottle','bowl','car','chair','cone',
    'cup','curtain','desk','door','dresser','flower_pot','glass_box','guitar','keyboard',
    'lamp','laptop','mantel','monitor','night_stand','person','piano','plant','radio',
    'range_hood','sink','sofa','stairs','stool','table','tent','toilet','tv_stand',
    'vase','wardrobe','xbox'
]

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    points = np.loadtxt(file).astype(np.float32)

    # pad or sample to 2048
    if points.shape[0] > NUM_POINTS:
        idx = np.random.choice(points.shape[0], NUM_POINTS, replace=False)
        points = points[idx, :]
    elif points.shape[0] < NUM_POINTS:
        pad = np.zeros((NUM_POINTS - points.shape[0], 3), dtype=np.float32)
        points = np.vstack((points, pad))

    points = np.expand_dims(points, axis=0)
    pred_val = sess.run(pred_softmax, feed_dict={pointclouds_pl: points, is_training_pl: False})
    pred_class = np.argmax(pred_val, axis=1)[0]
    confidence = float(np.max(pred_val))

    return jsonify({
        "predicted_index": int(pred_class),
        "predicted_label": classes[pred_class],
        "confidence": round(confidence * 100, 2)
    })

@app.route('/potree/libs/<path:filename>')
def potree_libs(filename):
    potree_libs_dir = os.path.join(os.path.dirname(__file__), 'potree', 'libs')
    return send_from_directory(potree_libs_dir, filename)

@app.route('/pointclouds/<cloud_name>/<path:filename>')
def pointcloud_file(cloud_name, filename):
    base_dir = os.path.join(os.path.dirname(__file__), 'data', 'pointclouds', cloud_name)
    return send_from_directory(base_dir, filename)

@app.route('/viewer/<cloud_name>')
def viewer(cloud_name):
    pointcloud_url = f'/pointclouds/{cloud_name}/metadata.json'
    return render_template('viewer.html', pointcloud_url=pointcloud_url, cloud_name=cloud_name)

@app.route("/api/pointclouds", methods=["GET"])
def list_pointclouds():
    status_map = {}

    for name in os.listdir(POINTCLOUD_DIR):
        mp = meta_path(name)
        if os.path.exists(mp):
            with open(mp) as f:
                meta = json.load(f)
                status = meta.get("status", "unknown")
                status_map.setdefault(status, []).append(name)

    return jsonify(status_map)


@app.route("/api/pointclouds/upload", methods=["POST"])
def upload_pointcloud():
    file = request.files.get("file")
    name = request.form.get("name")
    description = request.form.get("description")

    if not file or not name:
        return jsonify({"error": "Missing file or name"}), 400

    pc_dir = os.path.join(POINTCLOUD_DIR, name)
    if os.path.exists(pc_dir):
        return jsonify({"error": "A pointcloud with this name already exists"}), 400

    if file.filename.split('.')[-1].lower() != 'laz':
        return jsonify({"error": "Only .laz files are supported"}), 400

    # Save raw file
    raw_path = os.path.join(RAW_DIR, f"{name}.laz")
    file.save(raw_path)

    # Create folder
    os.makedirs(pc_dir)

    # Create meta.json
    meta = {
        "name": name,
        "description": description,
        "status": "pending"
    }
    write_meta(name, meta)

    # Queue job
    job_queue.put(Job(name))

    return jsonify({"message": "Upload successful", "name": name})

@app.route('/api/pointclouds/delete', methods=['POST'])
def delete_pointcloud():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({"error": "Missing pointcloud name"}), 400

    pc_dir = os.path.join(POINTCLOUD_DIR, name)
    raw_path = os.path.join(RAW_DIR, f"{name}.laz")

    # Remove the pointcloud directory if it exists
    if os.path.exists(pc_dir) and os.path.isdir(pc_dir):
        shutil.rmtree(pc_dir)

    # Remove the raw file if it exists
    if os.path.exists(raw_path) and os.path.isfile(raw_path):
        os.remove(raw_path)

    job_queue.queue = [job for job in job_queue.queue if job.name != name]
    return jsonify({"message": "Pointcloud deleted", "name": name})

@app.route("/debug/jobqueue")
def debug_jobqueue():
    q = list(job_queue.queue)
    return jsonify([job.name for job in q])

if __name__ == '__main__':
    # Enable debug mode based on environment
    debug_mode = os.getenv('FLASK_DEBUG', '0') == '1'
    start_worker()
    os.makedirs(RAW_DIR, exist_ok=True)
    os.makedirs(POINTCLOUD_DIR, exist_ok=True) 
    app.run(debug=debug_mode, host='0.0.0.0', port=8080)

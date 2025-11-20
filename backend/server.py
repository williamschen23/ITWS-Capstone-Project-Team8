from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS          # import
import numpy as np
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()
from models import pointnet_cls
import threading
import time
import subprocess
import os

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

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
POTREE_DIR = os.path.join(BASE_DIR, 'potree')

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

@app.route('/potree/<path:filename>')
def potree_static(filename):
    return send_from_directory(POTREE_DIR, filename)

def git_pull_periodically():
    while True:
        subprocess.run(['git', 'pull'])
        # every 60 seconds
        time.sleep(60)

if __name__ == '__main__':
    threading.Thread(target=git_pull_periodically, daemon=True).start()
    app.run(debug=True, host='0.0.0.0', port=8080)
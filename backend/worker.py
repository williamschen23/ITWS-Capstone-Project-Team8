import os
import subprocess
import threading
import queue
import json

RAW_DIR = "./data/raw"
POINTCLOUD_DIR = "./data/pointclouds"
POTREE_CONVERTER = "./potree/converter/PotreeConverter"
ENV = {"LD_LIBRARY_PATH": "./potree/converter"}

job_queue = queue.Queue()

class Job:
    def __init__(self, name):
        self.name = name

def meta_path(name):
    return os.path.join(POINTCLOUD_DIR, name, "meta.json")

def write_meta(name, data):
    with open(meta_path(name), "w") as f:
        json.dump(data, f, indent=2)

def read_meta(name):
    mp = meta_path(name)
    if os.path.exists(mp):
        with open(mp, "r") as f:
            return json.load(f)
    return {}

def update_status(name, status, error=None):
    meta = read_meta(name)
    meta["status"] = status
    meta["error"] = error
    write_meta(name, meta)

def run_potree_conversion(name):
    try:
        update_status(name, "processing", error=None)

        raw_file = os.path.join(RAW_DIR, f"{name}.laz")
        output_dir = os.path.join(POINTCLOUD_DIR, name)

        cmd = [
            POTREE_CONVERTER,
            raw_file,
            "-o", output_dir
        ]

        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=ENV
        )

        if result.returncode != 0:
            print(f"[Worker] PotreeConverter failed for {name}: {result.stderr}")
            update_status(name, "error", error=result.stderr.strip())
        else:
            print(f"[Worker] Conversion complete: {name}")
            update_status(name, "successful", error=None)

    except Exception as e:
        print(f"[Worker] CRITICAL ERROR converting {name}: {e}")
        update_status(name, "error", error=str(e))

def worker_loop():
    while True:
        job = job_queue.get()
        run_potree_conversion(job.name)
        job_queue.task_done()

def start_worker():
    thread = threading.Thread(target=worker_loop, daemon=True)
    thread.start()

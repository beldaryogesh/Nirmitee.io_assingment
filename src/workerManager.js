// create worker folder

import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerPath = path.join(__dirname, "worker.js");

export function runWorker(workerData) {
  try {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, { 
        workerData,
        resourceLimits: {
          maxOldGenerationSizeMb: 4096,  // 4GB heap
          maxYoungGenerationSizeMb: 2048, // 2GB young generation
        }
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

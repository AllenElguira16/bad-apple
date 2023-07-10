import { parentPort, workerData } from "worker_threads";
import { convertImageToAscii } from "./convertImageToAscii";
import fs from "fs";

const { imageFiles, height, width, consoleWidth, threadNumber } = workerData;
const frames: Record<string, string> = {};

async function main() {
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    console.log(
      `\x1b[${threadNumber + 2};0HWorker ${threadNumber + 1}: (${i + 1}/${
        imageFiles.length
      })`
    );

    frames[imageFile] = await convertImageToAscii({
      imageFile,
      consoleWidth,
      height,
      width,
    });
  }

  return frames;
}

main().then((frames) => parentPort.postMessage(frames));

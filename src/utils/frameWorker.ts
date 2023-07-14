import { parentPort, workerData } from "worker_threads";
import { getAsciiFrames } from "./getAsciiFrames";
import fs from "fs";

const { imageFiles, height, width, consoleWidth } = workerData;
const frames: Record<string, string> = {};

async function main() {
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    // console.log(
    //   `\x1b[${threadNumber + 2};0HWorker ${threadNumber + 1}: (${i + 1}/${
    //     imageFiles.length
    //   })`
    // );

    frames[imageFile] = await getAsciiFrames({
      imageFile,
      consoleWidth,
      height,
      width,
      hasColor: false,
    });
  }

  return frames;
}

main().then((frames) => parentPort.postMessage(frames));

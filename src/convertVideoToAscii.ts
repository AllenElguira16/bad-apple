// import logger from "log-update";
import * as rimraf from "rimraf";
import fs from "fs";
import ffmpeg from "ffmpeg";
import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import { FRAME_RATE, HEIGHT, WIDTH } from "./const";
import { cleanFiles } from "./cleanFiles";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const convertVideoToAscii = async (
  videoPath: string,
  numThreads: number
) => {
  if (!fs.existsSync(videoPath))
    throw new Error(`Path ${videoPath} does not exists!`);
  if (fs.existsSync("./frames")) rimraf.sync("./frames");

  const video = await new ffmpeg(videoPath);

  const metadata = video.metadata as Metadata;

  const height = process.stdout.rows;
  const width = Math.ceil(height * metadata.video.aspect.value);

  console.log("\x1b[1;1HLoading Video...");

  const imageFiles = (
    await video.fnExtractFrameToJPG("./frames", {
      frame_rate: FRAME_RATE,
      size: `${WIDTH}x?`,
      file_name: "%d",
    })
  )
    .sort((a, b) => {
      const aNum = Number(a.match(/[0-9]+/));
      const bNum = Number(b.match(/[0-9]+/));
      return aNum - bNum;
    })
    .map((frame) => path.resolve(frame));

  console.clear();
  console.log("\x1b[1;1HExtracting Frames...\n");

  const chunkSize = Math.ceil(imageFiles.length / numThreads);
  const workerPromises: Promise<Record<string, string>>[] = [];

  for (let i = 0; i < numThreads; i++) {
    const startIndex = i * chunkSize;
    const endIndex = Math.min(startIndex + chunkSize, imageFiles.length);
    const workerData = {
      imageFiles: imageFiles.slice(startIndex, endIndex),
      width,
      height,
      threadNumber: i,
      consoleWidth: process.stdout.columns,
    };

    const workerPromise = new Promise<Record<string, string>>(
      (resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, "./frameWorker.ts"), {
          workerData,
        });

        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0)
            reject(new Error(`Frame worker stopped with exit code ${code}`));
        });
      }
    );

    workerPromises.push(workerPromise);
  }

  const frames: string[] = [];

  (await Promise.all(workerPromises)).map((workerFrames) => {
    Object.keys(workerFrames).forEach((key) => {
      const index = Number(key.match(/[0-9]+/));
      frames[index] = workerFrames[key];
    });
  });

  return { frames, seconds: metadata.duration.seconds, fps: FRAME_RATE };
};

type Metadata = {
  filename: string;
  title: string;
  artist: string;
  album: string;
  track: string;
  date: string;
  synched: true;
  duration: { raw: string; seconds: number };
  video: {
    container: string;
    bitrate: number;
    stream: number;
    codec: string;
    resolution: { w: number; h: number };
    resolutionSquare: { w: number; h: number };
    aspect: { x: number; y: number; string: string; value: number };
    rotate: number;
    fps: number;
    pixelString: string;
    pixel: number;
  };
  audio: {
    codec: string;
    bitrate: string;
    sample_rate: number;
    stream: number;
    channels: { raw: string; value: number };
  };
};

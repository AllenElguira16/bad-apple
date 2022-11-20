import fs from "fs";
import { HEIGHT, WIDTH } from "./const";

export const extractFrames = async (path: string) => {
  const { ExtractFrames } = await import("./extract-frames");
  const HW = WIDTH.toString() + "x" + HEIGHT.toString();
  const logStream = fs.createWriteStream("./logs/logFile.log");

  const spawnProcess = require("child_process").spawn;
  let ffmpeg = spawnProcess("ffmpeg", [
    "-i",
    path,
    "-vcodec",
    "mjpeg",
    "-f",
    "rawvideo",
    "-s",
    HW, // size of one frame
    "pipe:1",
  ]);

  // ffmpeg.stderr.setEncoding('utf8');
  ffmpeg.stderr.pipe(logStream);

  let frames: Buffer[] = [];
  ffmpeg.stdout.pipe(new ExtractFrames("FFD8FF")).on("data", (data: Buffer) => {
    frames.push(data);
  });

  return new Promise<Buffer[]>((resolve) => {
    ffmpeg.on("close", function () {
      resolve(frames);
    });
  });
};

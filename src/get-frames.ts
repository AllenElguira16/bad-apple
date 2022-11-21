import fs from "fs";
import { spawn } from "child_process";
import { HEIGHT, WIDTH } from "./const";

export const extractFrames = async (path: string) => {
  const { ExtractFrames } = await import("./extract-frames");
  const logStream = fs.createWriteStream("./logs/logFile.log");

  let ffmpeg = spawn("ffmpeg", [
    "-i",
    path,
    "-vcodec",
    "mjpeg",
    "-f",
    "rawvideo",
    "-s",
    WIDTH.toString() + "x" + HEIGHT.toString(), // size of one frame
    "pipe:1",
  ]);

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

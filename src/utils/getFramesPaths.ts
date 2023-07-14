// import logger from "log-update";
import * as rimraf from "rimraf";
import fs from "fs";
import ffmpeg from "ffmpeg";
import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import { FRAME_RATE, HEIGHT, WIDTH } from "../const";
import { cleanFiles } from "./cleanFiles";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const getFramesPaths = async (videoPath: string, numThreads: number) => {
  const framesPath = path.resolve(__dirname, "../../temp/frames");

  if (!fs.existsSync(videoPath))
    throw new Error(`Path ${videoPath} does not exists!`);
  if (fs.existsSync(framesPath)) rimraf.sync(framesPath);

  const video = await new ffmpeg(videoPath);

  video.addCommand(
    "-filter:v",
    `minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=${FRAME_RATE}'`
  );
  const metadata = video.metadata as Metadata;

  const height = process.stdout.rows;
  const width = Math.ceil(height * metadata.video.aspect.value);

  console.log("\x1b[1;1HLoading Video...");

  const bufferData = await Promise.all(
    (
      await video.fnExtractFrameToJPG(framesPath, {
        frame_rate: FRAME_RATE,
        size: `${width}x?`,
        file_name: "%d",
      })
    )
      .sort((a, b) => {
        const aNum = Number(a.match(/[0-9]+/));
        const bNum = Number(b.match(/[0-9]+/));
        return aNum - bNum;
      })
      .map(async (file) => {
        const image = sharp(path.resolve(file));
        const metadata = await image.metadata();
        // image.resize(width, height);
        return { metadata, buffer: await image.raw().toBuffer() };
      })
  );

  return { bufferData, fps: FRAME_RATE, width, height };
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

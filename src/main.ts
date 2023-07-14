import path from "path";
import { setDriftlessInterval, clearDriftless } from "driftless";
import {
  getFramesPaths,
  AudioPlayer,
  cleanFiles,
  getAsciiFrames,
} from "./utils";

process.stdout.write("\x1B[?25l");
const videoPath = path.resolve(process.argv[2]);
const audioPlayer = await AudioPlayer(videoPath);

let driftlessInterval: number;
const numThreads = 8;

const cleanUp = () => {
  audioPlayer.kill();
  cleanFiles();
  clearDriftless(driftlessInterval);
  process.stdout.write("\x1B[?25h");
  process.exit();
};

console.clear();
const { bufferData, fps, height, width } = await getFramesPaths(
  videoPath,
  numThreads
);
// console.log(imageFiles);
let index = 0;

await audioPlayer.play();

driftlessInterval = setDriftlessInterval(async () => {
  index += 1;

  const frame = await getAsciiFrames({
    bufferData: bufferData[index],
    width,
    height,
    consoleWidth: process.stdout.columns,
    hasColor: true,
  });

  process.stdout.write(`\x1b[1;1H` + frame);

  if (index >= bufferData.length) {
    cleanUp();
  }
}, 1000 / fps);

//do something when app is closing
process.on("exit", cleanUp);

//catches ctrl+c event
process.on("SIGINT", cleanUp);

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", cleanUp);
process.on("SIGUSR2", cleanUp);

//catches uncaught exceptions
process.on("uncaughtException", cleanUp);

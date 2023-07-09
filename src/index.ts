import logger from "log-update";
import path from "path";
import { setDriftlessInterval, clearDriftless } from "driftless";
import { convertVideoToAscii } from "./convertVideoToAscii";
import { audioPlayer as baseAudioPlayer } from "./audioPlayer";
import fs from "fs";
import { secondsToDuration } from "./secondsToDuration";
import { metrics } from "./metrics";

const videoPath = path.resolve(process.argv[2]);
const audioPlayer = baseAudioPlayer(videoPath);

let interval: number;
const numThreads = 8;

(async () => {
  metrics.start();
  console.clear();
  const {
    frames,
    seconds: videoSeconds,
    fps,
  } = await convertVideoToAscii(videoPath, numThreads);
  metrics.end(numThreads);

  logger.clear();

  await audioPlayer.play();
  let seconds = 0;
  let i = 0;

  let secondsInterval = setInterval(() => {
    seconds++;
  }, 1000);

  interval = setDriftlessInterval(() => {
    const frame = frames[i];
    // const baseDuration = `${secondsToDuration(seconds)}:${secondsToDuration(
    //   videoSeconds
    // )}`;
    const padding = process.stdout.columns / 2 - frames.length / 2;

    process.stdout.write(`\x1b[1;1H` + frame);

    i++;
    if (i >= frames.length) {
      clearDriftless(interval);
      clearInterval(secondsInterval);
      audioPlayer.kill();
    }
  }, 1000 / fps);
})();

process.on("SIGINT", () => {
  audioPlayer.kill();
  clearDriftless(interval);
  process.exit();
});

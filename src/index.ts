// import logger from "log-update";
import path from "path";
import { setDriftlessInterval, clearDriftless } from "driftless";
import { convertVideoToAscii } from "./convertVideoToAscii";
import { AudioPlayer } from "./audioPlayer";
import { metrics } from "./metrics";
import { cleanFiles } from "./cleanFiles";

async function main() {
  const videoPath = path.resolve(process.argv[2]);
  const audioPlayer = await AudioPlayer(videoPath);

  let secondsInterval: NodeJS.Timer;
  let driftlessInterval: number;
  const numThreads = 8;

  const cleanUp = () => {
    audioPlayer.kill();
    cleanFiles();
    clearDriftless(driftlessInterval);
    clearInterval(secondsInterval);
    process.exit();
  };

  metrics.start();
  console.clear();
  const { frames, fps } = await convertVideoToAscii(videoPath, numThreads);
  metrics.end(numThreads);

  console.clear();

  audioPlayer.play();

  let seconds = 0;
  let i = 0;

  secondsInterval = setInterval(() => {
    seconds++;
  }, 1000);

  driftlessInterval = setDriftlessInterval(() => {
    const frame = frames[i];
    // const baseDuration = `${secondsToDuration(seconds)}:${secondsToDuration(
    //   videoSeconds
    // )}`;
    const padding = process.stdout.columns / 2 - frames.length / 2;

    process.stdout.write(`\x1b[1;1H` + frame);

    i++;
    if (i >= frames.length) {
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
}

main();

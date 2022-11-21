import path from "path";
import { readFileSync } from "fs";
import glob from "glob-promise";
import { AudioPlayer } from "./audio-player";

const audioPlayer = AudioPlayer();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const videoPath = path.resolve(__dirname, "../assets/hehe.mp4");

(async () => {
  const frames = (await glob(path.join(__dirname, `../frames/**/*.txt`))).map(
    (filePath) => readFileSync(filePath).toString()
  );

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    audioPlayer.play(videoPath);
    console.log(frame + `\nframes(${i + 1}/${frames.length})`);
    await sleep(1000 / 30);
  }
  audioPlayer?.kill();
})();

process.on("SIGINT", () => {
  audioPlayer?.kill();
  process.exit();
});

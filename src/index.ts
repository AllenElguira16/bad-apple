import path from "path";
import { setDriftlessInterval, clearDriftless } from "driftless";
import { extractFrames } from "./get-frames";
import { handleFrame } from "./handle-frame";
import { AudioPlayer } from "./audio-player";
import { getFps } from "./get-fps";

const audioPlayer = AudioPlayer();
const videoPath = path.resolve(__dirname, "../assets/rotating-rat.mp4");

let interval: number;

(async () => {
  process.stdout.clearLine(1);
  process.stdout.cursorTo(0);
  process.stdout.write("Loading Video...");
  const videoFrames = await extractFrames(videoPath);
  const fps = (await getFps(videoPath)) || 30;

  const frames: string[] = [];

  for (let i = 0; i < videoFrames.length; i++) {
    process.stdout.clearLine(1);
    process.stdout.cursorTo(0);
    const frame = videoFrames[i];
    process.stdout.write(
      `Extracting Frames... (${i + 1}/${videoFrames.length})`
    );
    frames.push(await handleFrame(frame));
  }

  let i = 0;
  interval = setDriftlessInterval(() => {
    audioPlayer.play(videoPath);
    process.stdout.cursorTo(0, 0);

    const frame = frames[i];
    process.stdout.write(frame + `\nframes(${i + 1}/${frames.length})`);
    i++;

    if (i >= frames.length) {
      clearDriftless(interval);
      audioPlayer?.kill();
    }
  }, 1000 / fps);

  audioPlayer?.kill();
})();

process.on("SIGINT", () => {
  audioPlayer?.kill();
  clearDriftless(interval);
  process.exit();
});

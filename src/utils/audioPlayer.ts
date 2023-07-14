import { spawn } from "child_process";
import type { ChildProcess } from "child_process";
import ffmpeg from "ffmpeg";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AudioPlayer = async (videoPath: string) => {
  const audioPath = path.resolve(__dirname, "../../temp/audio.mp3");
  const cmdmp3ExecutablePath = path.resolve(__dirname, "./cmdmp3/cmdmp3.exe");
  let spawnInstance: ChildProcess | undefined;

  const video = await new ffmpeg(videoPath);
  await video.fnExtractSoundToMP3(audioPath);

  return {
    play: () => {
      return new Promise<void>((resolve, reject) => {
        if (spawnInstance) {
          resolve();
          return;
        }

        spawnInstance = spawn(cmdmp3ExecutablePath, [audioPath], {
          shell: false,
          detached: true,
        });

        spawnInstance.once("spawn", () => {
          resolve();
        });

        spawnInstance.once("error", (error) => {
          if (error) reject(error);
        });
      });
    },
    // Kill audio player
    kill: () => {
      spawnInstance?.kill();
    },
  };
};

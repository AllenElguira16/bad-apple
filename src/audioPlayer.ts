import { spawn } from "child_process";
import type { ChildProcess } from "child_process";
import ffmpeg from "ffmpeg";
import Player from "play-sound";

export const AudioPlayer = async (videoPath: string) => {
  const audioPath = "./audio.mp3";
  let spawnInstance: ChildProcess | undefined;

  const video = await new ffmpeg(videoPath);
  await video.fnExtractSoundToMP3(audioPath);

  return {
    play: () => {
      spawnInstance = spawn(`./src/cmdmp3/cmdmp3.exe`, [audioPath], {
        shell: false,
        detached: true,
      });

      // return new Promise<void>((resolve, reject) => {
      //   if (spawnInstance) {
      //     resolve();
      //     return;
      //   }
      //   spawnInstance = spawn(`./src/cmdmp3/cmdmp3win.exe`, [audioPath], {
      //     shell: false,
      //     detached: true,
      //   });

      //   spawnInstance.once("spawn", () => {
      //     resolve();
      //   });

      //   spawnInstance.once("error", (error) => {
      //     if (error) reject(error);
      //   });
      // });
    },
    // Kill audio player
    kill: () => {
      spawnInstance?.kill();
    },
  };
};

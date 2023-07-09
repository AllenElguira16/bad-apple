import { spawn } from "child_process";
import type { ChildProcess } from "child_process";
import Player from "play-sound";

export const audioPlayer = (path: string) => {
  let spawnInstance: ChildProcess | undefined;

  return {
    play: () => {
      return new Promise<void>((resolve, reject) => {
        if (spawnInstance) {
          resolve();
          return;
        }

        spawnInstance = spawn("mplayer", ["-vo", "null", path], {
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

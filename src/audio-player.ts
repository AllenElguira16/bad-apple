import { spawn } from "child_process";
import type { ChildProcess } from "child_process";

export const AudioPlayer = () => {
  let spawnInstance: ChildProcess | undefined;

  return {
    play: (path: string) => {
      if (spawnInstance) return;

      // Start Player
      // NOTE: Change this depending on the environment,
      // in my case I use WSLENV so using mplayer.exe is not a problem
      spawnInstance = spawn("mplayer.exe", ["-vo", "null", path], {
        shell: false,
        detached: true,
      });
    },
    // Kill audio player
    kill: () => {
      spawnInstance?.kill();
    },
  };
};

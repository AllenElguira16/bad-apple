import { spawn } from "child_process";
import type { ChildProcess } from "child_process";

export const AudioPlayer = () => {
  let spawnInstance: ChildProcess | undefined;

  return {
    play: (path: string) => {
      if (spawnInstance) return;

      spawnInstance = spawn("mplayer.exe", ["-vo", "null", path], {
        // stdio: "inherit",
        shell: false,
        detached: true,
      });
    },
    kill: () => {
      spawnInstance?.kill();
    },
  };
};

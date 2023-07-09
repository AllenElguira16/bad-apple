import fs from "fs";
import { secondsToDuration } from "./secondsToDuration";

export const metrics = (() => {
  const metrics = fs.readFileSync("metrics.txt", "utf-8");
  let t1: number;
  let t2: number;

  return {
    start: () => {
      t1 = performance.now();
    },
    end: (numThreads: number) => {
      t2 = performance.now();
      const seconds = Math.round((t2 - t1) / 1000);
      const text = `${metrics}\nDate: ${new Date().toISOString()}\nNumber of Workers: ${numThreads}\nConvert Duration: ${secondsToDuration(
        seconds
      )}\n`;

      fs.writeFileSync("metrics.txt", text);
    },
  };
})();

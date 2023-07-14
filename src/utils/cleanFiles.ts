import { rimraf } from "rimraf";

export function cleanFiles() {
  for (const name of ["./frames", "./audio.mp3"]) {
    rimraf.sync(name);
  }
}

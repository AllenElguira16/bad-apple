import sharp from "sharp";
import path from "path";
import { HEIGHT, WIDTH } from "./const";

const density = [" ", ",", ":", ";", "+", "*", "?", "%", "S", "#", "@"];

export const handleFrame = async (bufferImage: Buffer) => {
  const { data: buffer, info } = await sharp(bufferImage)
    .resize(WIDTH, HEIGHT, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let x = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i += 3) {
    const char = density[Math.round(buffer[i] / 25.5)];
    output += char;
    x++;

    if (x >= WIDTH) {
      output += "\n";
      x = 0;
    }
  }

  return output.split("").join(" ");
};

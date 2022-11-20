import sharp from "sharp";
import { HEIGHT, WIDTH } from "./const";

const density = [" ", ",", ":", ";", "+", "*", "?", "%", "S", "#", "@"];

export const handleFrame = async (bufferImage: Buffer) => {
  // Set image to RAW file type
  const buffer = await sharp(bufferImage)
    .resize(WIDTH, HEIGHT, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer();

  let rowLength = 0;
  let output = "";

  // Read pixel density
  for (let i = 0; i < buffer.length; i += 3) {
    // Get character from density
    output += density[Math.round(buffer[i] / 25.5)];
    rowLength++;

    if (rowLength >= WIDTH) {
      output += "\n";
      rowLength = 0;
    }
  }

  return output.split("").join(" ");
};

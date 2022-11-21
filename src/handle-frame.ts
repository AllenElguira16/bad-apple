import Jimp from "jimp";
import { HEIGHT, WIDTH } from "./const";

const getChars = (type = 1) => {
  const chars = [
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-                          ",
    "@#S$%?*+;:,. ",
  ];

  return chars[type - 1];
};

const chars = getChars().split("").reverse().join("");

const getImageBuffer = async (bufferImage: Buffer) => {
  const image = await Jimp.read(bufferImage);

  return image.resize(WIDTH, HEIGHT);
};

export const handleFrame = async (bufferImage: Buffer) => {
  // Set image to RAW file type
  const image = await getImageBuffer(bufferImage);

  // let currentRowLength = 0;
  let output = "\n";

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));

      // Get Pixel Brightness
      // https://www.dynamsoft.com/blog/insights/image-processing/image-processing-101-color-space-conversion/
      const brightness = r * 0.299 + g * 0.587 + b * 0.114;
      // Get Range of Brightness
      const range = (chars.length - 1) / 255;
      // Map Character index from range ((e.g. map 32 from 1 to 256))
      const charIndex = Math.floor(brightness * range);
      // Append text
      output += chars.charAt(charIndex);
      // output += chars.charAt(charIndex);
    }

    output += "\n";
  }

  return output.split("").join(" ");
};

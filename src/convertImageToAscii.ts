// import Jimp from "jimp";
import sharp from "sharp";

const getChars = (type = 4) => {
  const chars = [
    "9765432EFGMYAHKBDPQWXNC9765432efgmyahkbdpqwxncvujzsrtLlI!i1'\"`^><|\\/}{][)(?!§¥£€$&80Oo@%#*+=;:~-,. ",
    /* cspell:disable-next-line */
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
    /* cspell:disable-next-line */
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-                          ",
    /* cspell:disable-next-line */
    "@#S$%?*+;:,. ",
    /* cspell:disable-next-line */
    "@%#*+=-:. ",
  ];

  return chars[type - 1];
};

const chars = getChars().split("").reverse().join("");

type Props = {
  imageFile: string;
  width: number;
  height: number;
  consoleWidth: number;
};

export async function convertImageToAscii({
  imageFile,
  height,
  width,
  consoleWidth,
}: Props) {
  const image = sharp(imageFile);
  const metadata = await image.metadata();
  const resizedImage = await image.resize(width, height).raw().toBuffer();
  const pixelData = Array.from(resizedImage);

  let output = [];

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * metadata.channels;
      const r = pixelData[pixelIndex];
      const g = pixelData[pixelIndex + 1];
      const b = pixelData[pixelIndex + 2];

      // Get Pixel Brightness
      // https://www.dynamsoft.com/blog/insights/image-processing/image-processing-101-color-space-conversion/
      const brightness = r * 0.299 + g * 0.587 + b * 0.114;
      // Get Range of Brightness
      const range = (chars.length - 1) / 255;
      // Map Character index from range ((e.g. map 32 from 1 to 256))
      const charIndex = Math.floor(brightness * range);
      // Append text
      row += chars.charAt(charIndex);
      row += chars.charAt(charIndex);
    }

    row = row.padStart(Math.floor(consoleWidth / 2) + row.length / 2, " ");

    // output.push(row);

    // output.push(row.padStart(Math.floor(consoleWidth / 2) + width / 2, " "));

    output.push(row);
  }

  return output.join("\n");
}

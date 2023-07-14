// import Jimp from "jimp";
import sharp from "sharp";

type Props = {
  bufferData: {
    metadata: sharp.Metadata;
    buffer: Buffer;
  };
  width: number;
  height: number;
  consoleWidth: number;
  hasColor: boolean;
};

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

const char = chars[2].split("").reverse().join("");

const charLookup: Record<number, string> = {};

const getChar = (r: number, g: number, b: number, hasColor: boolean) => {
  // Get Pixel Brightness
  // https://www.dynamsoft.com/blog/insights/image-processing/image-processing-101-color-space-conversion/
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  const ansiColor = hasColor ? `\x1b[38;2;${r};${g};${b}m` : "";
  const charLookupKey = ansiColor + brightness.toString();
  if (charLookup[charLookupKey]) return charLookup[charLookupKey];
  // Get Range of Brightness
  const range = (char.length - 1) / 255;
  // Map Character index from range ((e.g. map 32 from 1 to 256))
  const charIndex = Math.floor(brightness * range);
  // Append text
  // row += char.charAt(charIndex);
  const parsedChar = `${ansiColor}${char.charAt(charIndex)}`;
  charLookup[charLookupKey] = parsedChar;

  return parsedChar;
};

export async function getAsciiFrames({
  bufferData: { buffer, metadata },
  height,
  width,
  consoleWidth,
  hasColor,
}: Props) {
  // const image = sharp(imageFile);
  // const metadata = await image.metadata();
  // // image.resize(width, height);
  // const pixelData = await image.raw().toBuffer();
  // const pixelData = Array.from(resizedImage);

  let output = [];
  const paddingLength = Math.floor(consoleWidth / 2 - width);

  for (let y = 0; y < height; y++) {
    let row = Array(paddingLength)
      .map(() => "")
      .join(" ");

    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * metadata.channels;
      const r = buffer[pixelIndex];
      const g = buffer[pixelIndex + 1];
      const b = buffer[pixelIndex + 2];

      const char = getChar(r, g, b, hasColor);
      row += char;
      row += char;
    }

    output.push(row);
  }

  return output.join("\n");
}

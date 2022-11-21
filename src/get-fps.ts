import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

export const getFps = (filePath: string) => {
  const tempFilePath = path.resolve(__dirname, "temp.json");
  return new Promise<number>(async (resolve, reject) => {
    execSync(
      `ffprobe -v quiet -print_format json -show_format -show_streams '${filePath}' > ${tempFilePath}`
    );

    const data: Record<string, any> = JSON.parse(
      await fs.readFile(tempFilePath, "utf-8")
    );

    await fs.unlink(tempFilePath);

    const [frames, perSecond]: string[] = data.streams
      .find(({ codec_type }: any) => codec_type === "video")
      .r_frame_rate.split("/");

    resolve(parseInt(frames) / parseInt(perSecond));
  });
};

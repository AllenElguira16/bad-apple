const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

export const getVideoWH = async (path: string) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, data) => {
      if (!err) {
        // console.log(data);
        let i = 0;
        while (true) {
          if (data.streams[i].width) {
            break;
          }
          i++;
        }
        // console.log(data.streams[i].width, data.streams[i].height);

        resolve({
          width: data.streams[i].width!,
          height: data.streams[i].height!,
        });
      } else {
        reject(err);
      }
    });
  });
};

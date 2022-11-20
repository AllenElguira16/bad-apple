// const originalHeight = 360;
// const originalWidth = 480;

export const originalWidth = 112;
export const originalHeight = 84;

export const HEIGHT = Math.ceil(process.stdout.rows);
export const WIDTH = Math.ceil((originalWidth / originalHeight) * HEIGHT);

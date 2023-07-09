const RATIO = 1600 / 900;

// Get height based on window size
export const HEIGHT = Math.ceil(process.stdout.rows);

// Calculate width
export const WIDTH = Math.ceil(RATIO * HEIGHT);

export const FRAME_RATE = 30;

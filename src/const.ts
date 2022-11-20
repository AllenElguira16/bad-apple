const RATIO = 112 / 84;

// Get height based on window size
export const HEIGHT = Math.ceil(process.stdout.rows);

// Calculate width
export const WIDTH = Math.ceil(RATIO * HEIGHT);

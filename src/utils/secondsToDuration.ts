export function secondsToDuration(seconds: number) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  // Format the result as mm:ss
  var formattedTime =
    minutes.toString().padStart(2, "0") +
    ":" +
    remainingSeconds.toString().padStart(2, "0");

  return formattedTime;
}

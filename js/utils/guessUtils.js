export function getCorrectAnswerIndex() {
  let min = Math.ceil(0);
  let max = Math.floor(6);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


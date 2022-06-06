export function partitionSentence(
  sentence: string,
  position: number
): string[] {
  const words = sentence.split(" ");
  const pre = words.slice(0, position);
  const post = words.slice(position + 1);

  const preSentence = pre.join(" ");
  const postSentence = post.join(" ");

  return [preSentence, postSentence];
}

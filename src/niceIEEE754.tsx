export function niceIEEE754(n: number) {
  if (typeof n === "undefined") return n;

  return +n.toFixed(5);
}

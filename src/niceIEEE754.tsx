export function niceIEEE754(n: number) {
  if (!n) return n;
  const s = n.toString();
  const dp = s.indexOf(".");
  const a = /00000|99999/.exec(s.substring(dp + 1));
  if (a) {
    return n.toFixed(a.index);
  }
  return s;
}

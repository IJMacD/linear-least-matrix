// j =        0  1
//        [
// i = 0    [ 0, 1 ],
//        ]
// out
// j =         0
//        [
// i = 0     [ 0 ],
// i = 1     [ 1 ],
//        ]
export function transpose(values: number[][]) {
  const out = [] as number[][];
  if (values.length === 0) return out;
  for (let i = 0; i < values[0].length; i++) {
    out[i] = [] as number[];
    for (let j = 0; j < values.length; j++) {
      out[i][j] = values[j][i];
    }
  }
  return out;
}

export function mul(a: number[][], b: number[][]) {
  if (a.length === 0 || b.length === 0) return [];

  const h = a.length;
  const w = b[0].length;

  const n = b.length;

  if (a[0].length != n) {
    console.info(`Cannot multiply matrices ${w}x${n} by ${b.length}x${h}`);
    return [];
  }

  const out: number[][] = [];

  for (let i = 0; i < h; i++) {
    out[i] = [];
    for (let j = 0; j < w; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += a[i][k] * b[k][j];
      }
      out[i][j] = sum;
    }
  }

  return out;
}

function adj(a: number[][]) {
  const w = a.length;

  if (w === 0) return [];

  const h = a[0].length;

  if (w !== h) return [];

  if (w === 1) {
    return [[1]];
  }

  if (w === 2) {
    return [[a[1][1], -a[0][1]], [-a[1][0], a[0][0]]];
  }

  if (w === 3) {
    return transpose(cofactor(a));
  }

  console.info(`Cannot compute adjugate of ${h}x${w} matrix`);

  return [];
}

function det(a: number[][]) {
  const w = a.length;

  if (w === 0) return 1;

  const h = a[0].length;

  // Must be square
  if (w !== h) return 1;

  if (w === 1) {
    return a[0][0];
  }

  if (w === 2) {
    return a[0][0] * a[1][1] - a[0][1] * a[1][0];
  }

  if (w === 3) {
    return (
        a[0][0] * a[1][1] * a[2][2]
      + a[0][1] * a[1][2] * a[2][0]
      + a[0][2] * a[1][0] * a[2][1]
      - a[0][2] * a[1][1] * a[2][0]
      - a[0][1] * a[1][0] * a[2][2]
      - a[0][0] * a[1][2] * a[2][1]
    );
  }

  console.info(`Cannot compute determinate of ${h}x${w} matrix`);

  return 1;
}

function scalarMul(a: number[][], s: number) {
  const out = [] as number[][];
  for (let i = 0; i < a.length; i++) {
    out[i] = [];
    for (let j = 0; j < a[0].length; j++) {
      out[i][j] = a[i][j] * s;
    }
  }
  return out;
}

export function inv(a: number[][]) {
  return scalarMul(adj(a), 1 / det(a));
}

function cofactor (a: number[][]) {
  const w = a.length;

  if (w === 0) return [];

  const h = a[0].length;

  if (w !== h) return [];

  if (w !== 3) return [];

  const out: number[][] = [];

  for (let j = 0; j < h; j++) {
    out[j] = [];;
    for (let i = 0; i < w; i++) {
      const sm = subMatrix(a, i, j);
      const parity = ((i + j) % 2) ? -1 : 1;
      out[j][i] = parity * det(sm);
    }
  }

  return out;
}

function subMatrix (a: number[][], x: number, y: number) {
  const w = a.length;

  if (w === 0) return [];

  const h = a[0].length;

  const out:number[][] = [];

  for (let j = 0; j < h - 1; j++) {
    out[j] = [];
    for (let i = 0; i < w - 1; i++) {
      out[j][i] = a[j<y?j:j+1][i<x?i:i+1];
    }
  }

  return out;
}
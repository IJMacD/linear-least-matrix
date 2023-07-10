import { useState } from 'react'
import './App.css'

function App() {
  const [yInput,setYInput] = useState("");
  const [xInput,setXInput] = useState("");

  const yValues = parseMatrix(yInput);
  const xValues = parseMatrix(xInput);

  const xt = transpose(xValues);
  const xtx = mul(xt, xValues);
  const inv_xtx = inv(xtx);
  const inv_xtx_xt = mul(inv_xtx, xt);
  const beta = mul(inv_xtx_xt, yValues);

  return (
    <>
      <textarea value={yInput} onChange={e => setYInput(e.target.value)} placeholder='Y values' style={{height: 80}}/>
      <div style={{display:"flex",margin:10}}>
        <p>
          y =
        </p>
        <MatrixDisplay values={yValues} />
      </div>
      <textarea value={xInput} onChange={e => setXInput(e.target.value)} placeholder='X values' style={{height: 80}}/>
      <div style={{display:"flex",margin:10}}>
        <p>
          X =
        </p>
        <MatrixDisplay values={xValues} />
      </div>
      <div style={{display:"flex",margin:10}}>
        <p>
          X<sup>T</sup> =
        </p>
        <MatrixDisplay values={xt} />
      </div>
      <div style={{display:"flex",margin:10}}>
        <p>
          X<sup>T</sup> X =
        </p>
        <MatrixDisplay values={xtx} />
      </div>
      <div style={{display:"flex",margin:10}}>
        <p>
          (X<sup>T</sup> X)<sup>-1</sup> =
        </p>
        <MatrixDisplay values={inv_xtx} />
      </div>
      <div style={{display:"flex",margin:10}}>
        <p>
          (X<sup>T</sup> X)<sup>-1</sup> X<sup>T</sup> =
        </p>
        <MatrixDisplay values={inv_xtx_xt} />
      </div>
      <div style={{display:"flex",margin:10}}>
        <p>
          β =
        </p>
        <MatrixDisplay values={beta} />
      </div>
    </>
  )
}

export default App

function MatrixDisplay({ values }: { values: number[][] }) {
  return (
    <table className='matrix-table'>
      <tbody>
        {values.map((line, i) => <tr key={i}>{line.map((v, j) => <td key={j}>{niceIEE754(v)}</td>)}</tr>)}
      </tbody>
    </table>
  );
}

function parseMatrix(input: string) {
  return input.split("\n").filter(l => l.length).map(line => line.trim().replace(/,/g, " ").split(/\s+/).map(s => +s));
}
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



function transpose (values: number[][]) {
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

function mul (a: number[][], b: number[][]) {
  if (a.length === 0 || b.length === 0) return [];

  const h = a.length;
  const w = b[0].length;

  const n = b.length;

  if (a[0].length != n) return [];
    //{ throw Error(`Cannot multiply matrices ${w}x${n} by ${b.length}x${h}`); }

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

function adj (a: number[][]) {
  const w = a.length;

  if (w === 0) return [];

  const h = a[0].length;

  if (w === 2 && h == 2) {
    return [[a[1][1],-a[0][1]],[-a[1][0],a[0][0]]];
  }

  return [];

  // throw Error(`Cannot compute adjuct of ${h}x${w} matrix`);
}

function det (a: number[][]) {
  const w = a.length;

  if (w === 0) return 1;

  const h = a[0].length;

  if (w === 2 && h == 2) {
    return a[0][0] * a[1][1] - a[0][1] * a[1][0];
  }

  return 1;

  // throw Error(`Cannot compute determinate of ${h}x${w} matrix`);
}

function scalarMul (a: number[][], s: number) {
  const out = [] as number[][];
  for (let i = 0; i < a.length; i++) {
    out[i] = [];
    for (let j = 0; j < a[0].length; j++) {
      out[i][j] = a[i][j] * s;
    }
  }
  return out;
}

function inv (a: number[][]) {
  return scalarMul(adj(a), 1 / det(a));
}

function niceIEE754 (n: number) {
  if (!n) return n;
  const s = n.toString();
  const dp = s.indexOf(".");
  const a = /00000|99999/.exec(s.substring(dp+1));
  if (a) {
    return n.toFixed(a.index);
  }
  return s;
}
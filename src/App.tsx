import { useState } from 'react'
import './App.css'
import { Graph } from './Graph';
import { transpose, mul, inv } from './matrix';

enum Mode {
  "y=b1",
  "y=b1x",
  "y=b1+b2x",
  "y=b1x^2",
  "y=b1+b2x^2",
  "y=b1+b2x+b3x^2",
};

function App() {
  const [pointsInput,setPointsInput] = useState("");
  const [mode, setMode] = useState(Mode['y=b1+b2x']);

  const points = parsePoints(pointsInput);

  const yValues = points.map(p => [p[1]]);
  const xValues = getXValues(mode, points);

  const xt = transpose(xValues);
  const xtx = mul(xt, xValues);
  const inv_xtx = inv(xtx);
  const inv_xtx_xt = mul(inv_xtx, xt);
  const beta = mul(inv_xtx_xt, yValues);

  const trendFn = getTrendFn(mode, beta);

  return (
    <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <textarea value={pointsInput} onChange={e => setPointsInput(e.target.value)} placeholder='Points' style={{height: 80}}/>
        <Graph points={points} trendFn={trendFn} />
        <TrendlineDisplay mode={mode} coefficients={beta} />
      </div>
      <p>
        <b>y</b> = <b>X</b> β
      </p>
      <ul className='mode-selector'>
        <li className={mode === Mode['y=b1']?"active":""} onClick={() => setMode(Mode['y=b1'])}>y = β<sub>1</sub></li>
        <li className={mode === Mode['y=b1x']?"active":""} onClick={() => setMode(Mode['y=b1x'])}>y = β<sub>1</sub> x</li>
        <li className={mode === Mode['y=b1+b2x']?"active":""} onClick={() => setMode(Mode['y=b1+b2x'])}>y = β<sub>1</sub> + β<sub>2</sub> x</li>
        <li className={mode === Mode['y=b1x^2']?"active":""} onClick={() => setMode(Mode['y=b1x^2'])}>y = β<sub>1</sub> x<sup>2</sup></li>
        <li className={mode === Mode['y=b1+b2x^2']?"active":""} onClick={() => setMode(Mode['y=b1+b2x^2'])}>y = β<sub>1</sub> + β<sub>2</sub> x<sup>2</sup></li>
        <li className={mode === Mode['y=b1+b2x+b3x^2']?"active":""} onClick={() => setMode(Mode['y=b1+b2x+b3x^2'])}>y = β<sub>1</sub> + β<sub>2</sub> x + β<sub>3</sub> x<sup>2</sup></li>
      </ul>
      <div style={{display:"flex",margin:10}}>
        <p>
          y =
        </p>
        <MatrixDisplay values={yValues} />
      </div>
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
          (X<sup>T</sup> X)<sup>-1</sup> X<sup>T</sup> y =
        </p>
        <MatrixDisplay values={beta} />
      </div>
    </>
  )
}

export default App

function getXValues(mode: Mode, points: number[][]) {
  if (mode === Mode['y=b1']) {
    return points.map(() => [1]);
  }

  if (mode === Mode['y=b1x']) {
    return points.map(p => [p[0]]);
  }

  if (mode === Mode['y=b1+b2x']) {
    return points.map(p => [1, p[0]]);
  }

  if (mode === Mode['y=b1x^2']) {
    return points.map(p => [p[0] * p[0]]);
  }

  if (mode === Mode['y=b1+b2x^2']) {
    return points.map(p => [1, p[0] * p[0]]);
  }

  if (mode === Mode['y=b1+b2x+b3x^2']) {
    return points.map(p => [1, p[0], p[0] * p[0]])
  }

  return [];
}

function getTrendFn(mode: Mode, beta: number[][]) {
  if (beta.length === 0) return undefined;

  if (mode === Mode['y=b1']) {
    return () => beta[0][0];
  }

  if (mode === Mode['y=b1x']) {
    return (x: number) => beta[0][0] * x;
  }

  if (mode === Mode['y=b1+b2x']) {
    return (x: number) => beta[0][0] + beta[1][0] * x;
  }

  if (mode === Mode['y=b1x^2']) {
    return (x: number) => beta[0][0] * x * x;
  }

  if (mode === Mode['y=b1+b2x^2']) {
    return (x: number) => beta[0][0] + beta[1][0] * x * x;
  }

  if (mode === Mode['y=b1+b2x+b3x^2']) {
    return (x: number) => beta[0][0] + beta[1][0] * x + beta[2][0] * x * x;
  }

  return undefined;
}

function MatrixDisplay({ values }: { values: number[][] }) {
  return (
    <table className='matrix-table'>
      <tbody>
        {values.map((line, i) => <tr key={i}>{line.map((v, j) => <td key={j}>{niceIEEE754(v)}</td>)}</tr>)}
      </tbody>
    </table>
  );
}

function niceIEEE754 (n: number) {
  if (!n) return n;
  const s = n.toString();
  const dp = s.indexOf(".");
  const a = /00000|99999/.exec(s.substring(dp+1));
  if (a) {
    return n.toFixed(a.index);
  }
  return s;
}

function parsePoints (input: string) {
  return input.split("\n").filter(l => l.length).map(line => line.trim().replace(/[^-\d,.\s]/g, "").split(/[,\s]+/,2).map(s => +s));
}

function TrendlineDisplay ({ mode, coefficients }: { mode: Mode, coefficients: number[][] }) {
  if (coefficients.length === 0) return null;

  if (mode === Mode['y=b1']) {
    return <span>y = {niceIEEE754(coefficients[0][0])}</span>;
  }

  if (mode === Mode['y=b1x']) {
    return <span>y = {niceIEEE754(coefficients[0][0])}x</span>
  }

  if (mode === Mode['y=b1+b2x']) {
    const b2 = coefficients[1][0];
    return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x</span>
  }

  if (mode === Mode['y=b1x^2']) {
    return <span>y = {niceIEEE754(coefficients[0][0])}x<sup>2</sup></span>
  }

  if (mode === Mode['y=b1+b2x^2']) {
    const b2 = coefficients[1][0];
    return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x<sup>2</sup></span>
  }

  if (mode === Mode['y=b1+b2x+b3x^2']) {
    const b2 = coefficients[1][0];
    const b3 = coefficients[2][0];
    return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x {b3 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b3))}x<sup>2</sup></span>
  }

  return null;
}
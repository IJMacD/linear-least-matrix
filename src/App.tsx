import { useState } from 'react'
import './App.css'
import { Graph } from './Graph';
import { transpose, mul, inv } from './matrix';
import { niceIEEE754 } from './niceIEEE754';
import { modes } from './modes';

type Mode = keyof typeof modes;

function App() {
  const [pointsInput,setPointsInput] = useState("");
  const [mode, setMode] = useState('y=b1+b2x' as Mode);

  const points = parsePoints(pointsInput);

  const modeObject = modes[mode];

  const yValues = points.map(p => [p[1]]);
  const xValues = modeObject.getXValues(points);

  const xt = transpose(xValues);
  const xtx = mul(xt, xValues);
  const inv_xtx = inv(xtx);
  const inv_xtx_xt = mul(inv_xtx, xt);
  const beta = mul(inv_xtx_xt, yValues);

  const trendFn = getTrendFn(mode, beta);

  const avgY = yValues.length > 0 ? yValues.reduce((total, y) => total + y[0], 0) / yValues.length : 1;
  const ss_res = trendFn ? points.reduce((total, point) => total + Math.pow(point[1] - trendFn(point[0]), 2), 0) : NaN;
  const ss_tot = yValues.reduce((total, y) => total + Math.pow(y[0] - avgY, 2), 0);
  const rSquared = 1 - (ss_res / ss_tot);

  return (
    <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <textarea value={pointsInput} onChange={e => setPointsInput(e.target.value)} placeholder='Points' style={{height: 256}}/>
        <Graph points={points} trendFn={trendFn} />
        <TrendlineDisplay mode={mode} coefficients={beta} />
        {
          !isNaN(ss_res) &&
          <p style={{margin:"1em 2em"}}>
            R<sup>2</sup> = {rSquared.toPrecision(4)}
          </p>
        }
      </div>
      <p>
        <math><mi style={{fontWeight:"bold"}}>y</mi> <mo>=</mo> <mi style={{fontWeight:"bold"}}>X</mi> <mi>β</mi></math>
      </p>
      <ul className='mode-selector'>
        {
          Object.keys(modes).map(modeKey => <li key={modeKey} className={mode === modeKey?"active":""} onClick={() => setMode(modeKey as Mode)}>{modes[modeKey as Mode].display}</li>)
        }
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
        <p style={{minWidth: 100, textAlign: "left"}}>
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


function getTrendFn(mode: Mode, beta: number[][]) {
  if (beta.length === 0) return undefined;

  return modes[mode].getTrendFn(beta);
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

function parsePoints (input: string) {
  return input.trim().split("\n").filter(l => l.length).map(line => line.trim().replace(/[^-\d,.\s]/g, "").split(/[,\s]+/,2).map(s => +s));
}

function TrendlineDisplay ({ mode, coefficients }: { mode: Mode, coefficients: number[][] }) {
  if (coefficients.length === 0) return null;

  if (coefficients.some(c => isNaN(c[0]))) return null;

  return modes[mode].getTrendlineDisplay(coefficients);
}
import { useState } from 'react'
import './App.css'
import { Graph } from './Graph';
import { transpose, mul, inv } from './matrix';
import { niceIEEE754 } from './niceIEEE754';
import { Equation, EquationDisplay, makeModeObject, Mode, Term } from './equation';

const modes: Equation[] = [
  { terms: [Term.Constant] },
  { terms: [Term.Linear] },
  { terms: [Term.Constant, Term.Linear] },
  { terms: [Term.Quadratic] },
  { terms: [Term.Constant, Term.Quadratic] },
  { terms: [Term.Constant, Term.Linear, Term.Quadratic] },
  { terms: [Term.SquareRoot] },
  { terms: [Term.Constant, Term.SquareRoot] },
  { terms: [Term.Inverse] },
  { terms: [Term.Constant, Term.Inverse] },
  { terms: [Term.Constant, Term.Sin] },
  { terms: [Term.Constant, Term.Cos] },
  { terms: [Term.Constant, Term.Sin2x] },
  { terms: [Term.Constant, Term.Cos2x] },
  { terms: [Term.Constant, Term.Sin4x] },
  { terms: [Term.Constant, Term.Cos4x] },
  { terms: [Term.Constant, Term.SinHalfX] },
  { terms: [Term.Constant, Term.CosHalfX] },
  { terms: [Term.Constant, Term.SinSquared] },
  { terms: [Term.Constant, Term.CosSquared] },
  { terms: [Term.Constant, Term.SinXSquared] },
  { terms: [Term.Constant, Term.CosXSquared] },
  { terms: [Term.Exp] },
  { terms: [Term.Constant, Term.Exp] },
  { terms: [Term.Log] },
  { terms: [Term.Constant, Term.Log] },
]

function App() {
  const [pointsInput, setPointsInput] = useState("");
  const [selectedModeIndex, setSelectedModeIndex] = useState(2);

  const points = parsePoints(pointsInput);

  const modeObject = makeModeObject(modes[selectedModeIndex]);

  const yValues = points.map(p => [p[1]]);
  const xValues = modeObject.getXValues(points);

  const xt = transpose(xValues);
  const xtx = mul(xt, xValues);
  const inv_xtx = inv(xtx);
  const inv_xtx_xt = mul(inv_xtx, xt);
  const beta = mul(inv_xtx_xt, yValues);

  const trendFn = modeObject.getTrendFn(beta);

  const avgY = yValues.length > 0 ? yValues.reduce((total, y) => total + y[0], 0) / yValues.length : 1;
  const ss_res = trendFn ? points.reduce((total, point) => total + Math.pow(point[1] - trendFn(point[0]), 2), 0) : NaN;
  const ss_tot = yValues.reduce((total, y) => total + Math.pow(y[0] - avgY, 2), 0);
  const rSquared = 1 - (ss_res / ss_tot);

  return (
    <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <textarea value={pointsInput} onChange={e => setPointsInput(e.target.value)} placeholder='Points' style={{height: 256}}/>
        <Graph points={points} trendFn={trendFn} />
        <TrendLineDisplay mode={modeObject} coefficients={beta} />
        {
          !isNaN(ss_res) &&
          <p style={{margin:"1em 2em"}}>
            <math><msup><mi>R</mi><mn>2</mn></msup> <mo>=</mo> <mn>{rSquared.toPrecision(4)}</mn></math>
          </p>
        }
      </div>
      <p>
        <math><mi style={{fontWeight:"bold"}}>y</mi> <mo>=</mo> <mi style={{fontWeight:"bold"}}>X</mi> <mi>β</mi></math>
      </p>
      <ul className='mode-selector'>
        {
          modes.map((m, i) => <li key={i} className={i === selectedModeIndex?"active":""} onClick={() => setSelectedModeIndex(i)}><EquationDisplay equation={m} /></li>)
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

function MatrixDisplay({ values }: { values: number[][] }) {
  return (
    <table className='matrix-table'>
      <tbody>
        {values.map((line, i) => <tr key={i}>{line.map((v, j) => <td key={j}>{niceIEEE754(v)}</td>)}</tr>)}
      </tbody>
    </table>
  );
}

function parsePoints (input: string): [number, number][] {
  return input.trim().split("\n").filter(l => l.length).map(line => line.trim().replace(/[^-\d,.\s]/g, "").split(/[,\s]+/,2).map(s => +s)) as [number, number][];
}

function TrendLineDisplay ({ mode, coefficients }: { mode: Mode, coefficients: number[][] }) {
  if (coefficients.length === 0) return null;

  if (coefficients.some(c => isNaN(c[0]))) return null;

  return mode.getTrendLineDisplay(coefficients);
}

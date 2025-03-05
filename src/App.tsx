import { useState } from 'react'
import './App.css'
import { Graph } from './Graph';
import { transpose, mul, inv } from './matrix';
import { niceIEEE754 } from './niceIEEE754';
import { Equation, EquationDisplay, makeModeObject, Mode, Term } from './equation';

const modes: Equation[] = [
  [Term.Constant],
  [Term.Linear],
  [Term.Constant, Term.Linear],
  [Term.Quadratic],
  [Term.Constant, Term.Quadratic],
  [Term.Constant, Term.Linear, Term.Quadratic],
  [Term.SquareRoot],
  [Term.Constant, Term.SquareRoot],
  [Term.Inverse],
  [Term.Constant, Term.Inverse],
  [Term.Constant, Term.Sin],
  [Term.Constant, Term.Cos],
  [Term.Constant, Term.Sin2x],
  [Term.Constant, Term.Cos2x],
  [Term.Constant, Term.Sin4x],
  [Term.Constant, Term.Cos4x],
  [Term.Constant, Term.SinHalfX],
  [Term.Constant, Term.CosHalfX],
  [Term.Constant, Term.SinSquared],
  [Term.Constant, Term.CosSquared],
  [Term.Constant, Term.SinXSquared],
  [Term.Constant, Term.CosXSquared],
  [Term.Exp],
  [Term.Constant, Term.Exp],
  [Term.Log],
  [Term.Constant, Term.Log],
  [Term.Sin, Term.Sin2x, Term.Sin3x, Term.Sin4x],
  [Term.Cos, Term.Cos2x, Term.Cos3x, Term.Cos4x],
  [Term.Sin, Term.Sin2x, Term.Sin3x, Term.Sin4x, Term.Sin5x],
  [Term.Cos, Term.Cos2x, Term.Cos3x, Term.Cos4x, Term.Cos5x],
  [Term.Sin, Term.Sin2x, Term.Sin3x, Term.Sin4x, Term.Sin5x, Term.Sin6x],
  [Term.Sin, Term.Sin3x, Term.Sin5x, Term.Sin7x, Term.Sin9x],
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
  const ss_res = trendFn && beta.length > 0 ? points.reduce((total, point) => total + Math.pow(point[1] - trendFn(point[0]), 2), 0) : NaN;
  const ss_tot = yValues.reduce((total, y) => total + Math.pow(y[0] - avgY, 2), 0);
  const rSquared = 1 - (ss_res / ss_tot);

  return (
    <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <textarea value={pointsInput} onChange={e => setPointsInput(e.target.value)} placeholder='Points' style={{height: 256}}/>
        <Graph points={points} trendFn={trendFn||void 0} />
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

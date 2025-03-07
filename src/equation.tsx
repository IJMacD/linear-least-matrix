import React from "react";
import { niceIEEE754 } from "./niceIEEE754";

export type Vector = number[];

export type Matrix = number[][];

export enum Term {
  Constant,
  Linear,
  Quadratic,
  Cubic,
  Quartic,
  Quintic,
  SquareRoot,
  Inverse,
  Sin,
  Cos,
  Sin2x,
  Cos2x,
  Sin3x,
  Cos3x,
  Sin4x,
  Cos4x,
  Sin5x,
  Cos5x,
  Sin6x,
  Sin7x,
  Sin8x,
  Sin9x,
  SinHalfX,
  CosHalfX,
  SinQuarterX,
  CosQuarterX,
  SinSquared,
  CosSquared,
  SinXSquared,
  CosXSquared,
  Exp,
  Log,
}

export type Equation = Term[];

export interface Mode {
  getXValues: (points: [number, number][]) => Matrix,
  getTrendFn: (coefficients: Matrix) => ((x: number) => number)|null,
  getTrendLineDisplay: (coefficients: Matrix) => React.ReactNode,
}

export function makeModeObject (equation: Equation): Mode {
  return {
    getXValues: getXValueFn(equation),
    getTrendFn: getTrendFnFn(equation),
    getTrendLineDisplay: getTrendLineDisplayFn(equation),
  }
}

export function EquationDisplay ({equation}: {equation: Equation}): React.ReactNode {
  return (
    <math>
      <mi>y</mi>
      <mo>=</mo>
      {
        equation.map((t, i) => {
          const d = getTermDisplay(t);
          const c = <msub><mi>β</mi><mn>{i}</mn></msub>;
          return <React.Fragment key={i}>{i > 0 ? <mo>+</mo>:null}{c}{d}</React.Fragment>;
        })
      }
    </math>
  )
}

function getXValueFn (equation: Equation) {
  return function (points: [number, number][]): number[][] {
    return points.map(([x]) => equation.map(t => getTermFn(t)(x)));
  }
}

function getTrendFnFn (equation: Equation) {
  return (coefficients: Matrix) => coefficients.length > 0 ? (x: number) => equation.map((t, i) => coefficients[i][0] * getTermFn(t)(x)).reduce((s, t) => s + t, 0) : null;
}

function getTrendLineDisplayFn (equation: Equation) {
  return (coefficients: Matrix) => {
    let firstTerm = true;

    return (
      <math>
        <mi>y</mi>
        <mo>=</mo>
        {
          equation.map((t, i) => {
            const c = coefficients[i][0];
            const _c = niceIEEE754(Math.abs(c));
            if (_c === 0) return null;

            const f = firstTerm;
            firstTerm = false;

            const x = getTermDisplay(t);

            if (t === Term.Inverse) {
              return (
                <>
                  {(!f || c < 0) && <mo>{c < 0 ? "−" : "+"}</mo>}
                  <mfrac><mn>{_c}</mn><mi>x</mi></mfrac>
                </>
              );
            }

            return (
              <React.Fragment key={i}>
                {
                  _c === 1 && x != null ?
                    null :
                    (f ?
                      <mn>{niceIEEE754(c)}</mn>
                      :
                      <>
                        <mo>{c < 0 ? "−" : "+"}</mo>
                        {_c === 1 ? null : <mn>{_c}</mn>}
                      </>
                    )
                  }
                {x}
              </React.Fragment>
            );
          })
        }
      </math>
    )
  };
}

function getTermDisplay (term: Term): React.ReactNode {
  switch(term) {
    case Term.Constant: return null;
    case Term.Linear: return <mi>x</mi>;
    case Term.Quadratic: return <msup><mi>x</mi><mn>2</mn></msup>;
    case Term.Cubic: return <msup><mi>x</mi><mn>3</mn></msup>;
    case Term.Quartic: return <msup><mi>x</mi><mn>4</mn></msup>;
    case Term.Quintic: return <msup><mi>x</mi><mn>5</mn></msup>;
    case Term.SquareRoot: return <msqrt><mi>x</mi></msqrt>;
    case Term.Inverse: return <mfrac><mn>1</mn><mi>x</mi></mfrac>;
    case Term.Sin: return <><mi>sin</mi><mi>x</mi></>
    case Term.Cos: return <><mi>cos</mi><mi>x</mi></>
    case Term.Sin2x: return <><mi>sin</mi><mn>2</mn><mi>x</mi></>
    case Term.Cos2x: return <><mi>cos</mi><mn>2</mn><mi>x</mi></>
    case Term.Sin3x: return <><mi>sin</mi><mn>3</mn><mi>x</mi></>
    case Term.Cos3x: return <><mi>cos</mi><mn>3</mn><mi>x</mi></>
    case Term.Sin4x: return <><mi>sin</mi><mn>4</mn><mi>x</mi></>
    case Term.Cos4x: return <><mi>cos</mi><mn>4</mn><mi>x</mi></>
    case Term.Sin5x: return <><mi>sin</mi><mn>5</mn><mi>x</mi></>
    case Term.Cos5x: return <><mi>cos</mi><mn>5</mn><mi>x</mi></>
    case Term.Sin6x: return <><mi>sin</mi><mn>6</mn><mi>x</mi></>
    case Term.Sin7x: return <><mi>sin</mi><mn>7</mn><mi>x</mi></>
    case Term.Sin8x: return <><mi>sin</mi><mn>8</mn><mi>x</mi></>
    case Term.Sin9x: return <><mi>sin</mi><mn>9</mn><mi>x</mi></>
    case Term.SinHalfX: return <><mi>sin</mi><mfrac><mi>x</mi><mn>2</mn></mfrac></>
    case Term.CosHalfX: return <><mi>cos</mi><mfrac><mi>x</mi><mn>2</mn></mfrac></>
    case Term.SinQuarterX: return <><mi>cos</mi><mfrac><mi>x</mi><mn>4</mn></mfrac></>
    case Term.CosQuarterX: return <><mi>cos</mi><mfrac><mi>x</mi><mn>4</mn></mfrac></>
    case Term.SinSquared: return <><msup><mi>sin</mi><mn>2</mn></msup><mi>x</mi></>
    case Term.CosSquared: return <><msup><mi>cos</mi><mn>2</mn></msup><mi>x</mi></>
    case Term.SinXSquared: return <><mi>sin</mi><msup><mi>x</mi><mn>2</mn></msup></>
    case Term.CosXSquared: return <><mi>cos</mi><msup><mi>x</mi><mn>2</mn></msup></>
    case Term.Exp: return <><msup><mi>e</mi><mi>x</mi></msup></>
    case Term.Log: return <><mi>log</mi><mi>x</mi></>
  }
}

function getTermFn (term: Term): (x: number) => number {
  switch (term) {
    case Term.Constant: return () => 1;
    case Term.Linear: return (x) => x;
    case Term.Quadratic: return (x) => x * x;
    case Term.Cubic: return (x) => x * x * x;
    case Term.Quartic: return (x) => x * x * x * x;
    case Term.Quintic: return (x) => x * x * x * x * x;
    case Term.SquareRoot: return Math.sqrt;
    case Term.Inverse: return x => 1/x;
    case Term.Sin: return Math.sin;
    case Term.Cos: return Math.cos;
    case Term.Sin2x: return x => Math.sin(2 * x);
    case Term.Cos2x: return x => Math.cos(2 * x);
    case Term.Sin3x: return x => Math.sin(3 * x);
    case Term.Cos3x: return x => Math.cos(3 * x);
    case Term.Sin4x: return x => Math.sin(4 * x);
    case Term.Cos4x: return x => Math.cos(4 * x);
    case Term.Sin5x: return x => Math.sin(5 * x);
    case Term.Cos5x: return x => Math.cos(5 * x);
    case Term.Sin6x: return x => Math.sin(6 * x);
    case Term.Sin7x: return x => Math.sin(7 * x);
    case Term.Sin8x: return x => Math.sin(8 * x);
    case Term.Sin9x: return x => Math.sin(9 * x);
    case Term.SinHalfX: return x => Math.sin(x / 2);
    case Term.CosHalfX: return x => Math.cos(x / 2);
    case Term.SinQuarterX: return x => Math.sin(x / 4);
    case Term.CosQuarterX: return x => Math.cos(x / 4);
    case Term.SinSquared: return x => Math.sin(x) * Math.sin(x);
    case Term.CosSquared: return x => Math.cos(x) * Math.cos(x);
    case Term.SinXSquared: return x => Math.sin(x * x);
    case Term.CosXSquared: return x => Math.cos(x * x);
    case Term.Exp: return Math.exp;
    case Term.Log: return Math.log;

  }
}
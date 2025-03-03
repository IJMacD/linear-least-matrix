import { niceIEEE754 } from "./niceIEEE754";

export const modes = {
  "y=b1": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub></math>,
    getXValues: (points: number[][]) => points.map(() => [1]),
    getTrendFn: (beta: number[][]) => () => beta[0][0],
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])}</span>,
  },
  "y=b1x": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mi>x</mi></math>,
    getXValues: (points: number[][]) => points.map(p => [p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * x,
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])}x</span>,
  },
  "y=b1+b2x": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub> <mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>x</mi></math>,
    getXValues: (points: number[][]) => points.map(p => [1, p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * x,
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x</span>
    },
  },
  "y=b1x^2": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><msup><mi>x</mi><mn>2</mn></msup></math>,
    getXValues: (points: number[][]) => points.map(p => [p[0] * p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * x * x,
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])}x<sup>2</sup></span>,
  },
  "y=b1+b2x^2": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><msup><mi>x</mi><mn>2</mn></msup></math>,
    getXValues: (points: number[][]) => points.map(p => [1, p[0] * p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * x * x,
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x<sup>2</sup></span>
    },
  },
  "y=b1+b2x+b3x^2": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>x</mi><mo>+</mo><msub><mi>β</mi><mn>3</mn></msub><msup><mi>x</mi><mn>2</mn></msup></math>,
    getXValues: (points: number[][]) => points.map(p => [1, p[0], p[0] * p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * x + beta[2][0] * x * x,
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      const b3 = coefficients[2][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x {b3 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b3))}x<sup>2</sup></span>
    },
  },
  "y=b1x^0.5": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><msqrt><mi>x</mi></msqrt></math>,
    getXValues: (points: number[][]) => points.map(p => [Math.sqrt(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * Math.sqrt(x),
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])}x<sup>0.5</sup></span>,
  },
  "y=b1+b2x^0.5": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><msqrt><mi>x</mi></msqrt></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sqrt(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sqrt(x),
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])} + {niceIEEE754(coefficients[1][0])}x<sup>0.5</sup></span>,
  },
  "y=b1/x": {
    display: <math><mi>y</mi> <mo>=</mo> <mfrac><msub><mi>β</mi><mn>1</mn></msub><mi>x</mi></mfrac></math>,
    getXValues: (points: number[][]) => points.map(p => [1/p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] / x,
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])}/x</span>,
  },
  "y=b1+b2sinx": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>sin</mi><mi>x</mi></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(x)</span>;
    },
  },
  "y=b1+b2cosx": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>cos</mi><mi>x</mi></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.cos(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.cos(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} cos(x)</span>;
    },
  },
  "y=b1+b2sin2x": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>sin</mi><mn>2</mn><mi>x</mi></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(2 * p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(2*x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(2x)</span>;
    },
  },
  "y=b1+b2sin0.5x": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>sin</mi><mfrac><mi>x</mi><mn>2</mn></mfrac></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(0.5 * p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(0.5*x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(x/2)</span>;
    },
  },
  "y=b1+b2sin0.25x": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>sin</mi><mfrac><mi>x</mi><mn>4</mn></mfrac></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(0.25 * p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(0.25*x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(x/4)</span>;
    },
  },
  "y=b1+b2sinx^2": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>sin</mi><msup><mi>x</mi><mn>2</mn></msup></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(p[0] * p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(x*x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(x<sup>2</sup>)</span>;
    },
  },
  "y=b1e^x": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><msup><mi>e</mi><mi>x</mi></msup></math>,
    getXValues: (points: number[][]) => points.map(p => [Math.exp(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * Math.exp(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      return <span>y = {niceIEEE754(coefficients[0][0])} e<sup>x</sup></span>;
    },
  },
  "y=b1+b2e^x": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><msup><mi>e</mi><mi>x</mi></msup></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.exp(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.exp(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} e<sup>x</sup></span>;
    },
  },
  "y=b1lgx": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mi>log</mi><mi>x</mi></math>,
    getXValues: (points: number[][]) => points.map(p => [Math.log10(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * Math.log10(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      return <span>y = {niceIEEE754(coefficients[0][0])} log( x )</span>;
    },
  },
  "y=b1+b2lgx": {
    display: <math><mi>y</mi> <mo>=</mo> <msub><mi>β</mi><mn>1</mn></msub><mo>+</mo><msub><mi>β</mi><mn>2</mn></msub><mi>log</mi><mi>x</mi></math>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.log10(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.log10(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} log( x )</span>;
    },
  },
}
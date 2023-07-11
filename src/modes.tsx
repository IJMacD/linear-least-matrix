import { niceIEEE754 } from "./niceIEEE754";

export const modes = {
  "y=b1": {
    display: <>y = β<sub>1</sub></>,
    getXValues: (points: number[][]) => points.map(() => [1]),
    getTrendFn: (beta: number[][]) => () => beta[0][0],
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])}</span>,
  },
  "y=b1x": {
    display: <>y = β<sub>1</sub> x</>,
    getXValues: (points: number[][]) => points.map(p => [p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * x,
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])}x</span>,
  },
  "y=b1+b2x": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> x</>,
    getXValues: (points: number[][]) => points.map(p => [1, p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * x,
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x</span>
    },
  },
  "y=b1x^2": {
    display: <>y = β<sub>1</sub> x<sup>2</sup></>,
    getXValues: (points: number[][]) => points.map(p => [p[0] * p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * x * x,
    getTrendlineDisplay: (coefficients: number[][]) => <span>y = {niceIEEE754(coefficients[0][0])}x<sup>2</sup></span>,
  },
  "y=b1+b2x^2": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> x<sup>2</sup></>,
    getXValues: (points: number[][]) => points.map(p => [1, p[0] * p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * x * x,
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x<sup>2</sup></span>
    },
  },
  "y=b1+b2x+b3x^2": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> x + β<sub>3</sub> x<sup>2</sup></>,
    getXValues: (points: number[][]) => points.map(p => [1, p[0], p[0] * p[0]]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * x + beta[2][0] * x * x,
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      const b3 = coefficients[2][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))}x {b3 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b3))}x<sup>2</sup></span>
    },
  },
  "y=b1+b2sinx": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> sin( x )</>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(x)</span>;
    },
  },
  "y=b1+b2cosx": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> cos( x )</>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.cos(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.cos(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} cos(x)</span>;
    },
  },
  "y=b1+b2sin2x": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> sin( 2x )</>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(2 * p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(2*x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(2x)</span>;
    },
  },
  "y=b1+b2sin0.5x": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> sin( x/2 )</>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(0.5 * p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(0.5*x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(x/2)</span>;
    },
  },
  "y=b1+b2sin0.25x": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> sin( x/4 )</>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.sin(0.25 * p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.sin(0.25*x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} sin(x/4)</span>;
    },
  },
  "y=b1e^x": {
    display: <>y = β<sub>1</sub> e <sup>x</sup></>,
    getXValues: (points: number[][]) => points.map(p => [Math.exp(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * Math.exp(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      return <span>y = {niceIEEE754(coefficients[0][0])} e<sup>x</sup></span>;
    },
  },
  "y=b1+b2e^x": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> e <sup>x</sup></>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.exp(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.exp(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} e<sup>x</sup></span>;
    },
  },
  "y=b1lgx": {
    display: <>y = β<sub>1</sub> log( x )</>,
    getXValues: (points: number[][]) => points.map(p => [Math.log10(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] * Math.log10(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      return <span>y = {niceIEEE754(coefficients[0][0])} log( x )</span>;
    },
  },
  "y=b1+b2lgx": {
    display: <>y = β<sub>1</sub> + β<sub>2</sub> log( x )</>,
    getXValues: (points: number[][]) => points.map(p => [1, Math.log10(p[0])]),
    getTrendFn: (beta: number[][]) => (x: number) => beta[0][0] + beta[1][0] * Math.log10(x),
    getTrendlineDisplay: (coefficients: number[][]) => {
      const b2 = coefficients[1][0];
      return <span>y = {niceIEEE754(coefficients[0][0])} {b2 < 0 ? "-" : "+"} {niceIEEE754(Math.abs(b2))} log( x )</span>;
    },
  },
}
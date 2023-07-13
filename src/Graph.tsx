import { useEffect, useRef } from "react";

export function Graph ({ points, trendFn = undefined, width = 256, height = 256 }: { points: number[][], trendFn?: (x: number) => number, width?: number, height?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");

        const pxWidth = width * devicePixelRatio;
        const pxHeight = height * devicePixelRatio;

        const gutter = 5 * devicePixelRatio;
        const r = 5 * devicePixelRatio;

        const xMax = Math.max(...points.map(p => p[0]||0)) * 1.1;
        const yMax = Math.max(...points.map(p => p[1]||0)) * 1.1;

        const xMin = Math.min(0, ...points.map(p => p[0]||0)) * 1.1;
        const yMin = Math.min(0, ...points.map(p => p[1]||0)) * 1.1;

        const xRange = xMax - xMin;
        const yRange = yMax - yMin;

        const gPxWidth = pxWidth - 2 * gutter;
        const gPxHeight = pxHeight - 2 * gutter;

        const xScale = gPxWidth / xRange;
        const yScale = gPxHeight / yRange;

        if (ctx) {
            ctx.canvas.width = pxWidth;
            ctx.canvas.height = pxHeight;

            ctx.beginPath();
            ctx.rect(gutter, gutter, gPxWidth, gPxHeight);
            const x0 = gutter + (0 - xMin) * xScale;
            const y0 = pxHeight - gutter - (0 - yMin) * yScale;
            ctx.moveTo(x0, gutter);
            ctx.lineTo(x0, pxHeight - gutter);
            ctx.moveTo(gutter, y0);
            ctx.lineTo(pxWidth - gutter, y0);
            ctx.strokeStyle = "grey";
            ctx.stroke();

            if (trendFn) {
                ctx.beginPath();
                for (let x = xMin; x <= xMax; x += 1/xScale) {
                    const y = trendFn(x);
                    ctx.lineTo(gutter + (x - xMin) * xScale, pxHeight - gutter - (y - yMin) * yScale);
                }
                ctx.strokeStyle = "red";
                ctx.stroke();
            }

            ctx.fillStyle = "red";
            for (const point of points) {
                const x = gutter + (point[0] - xMin) * xScale;
                const y = pxHeight - gutter - (point[1] - yMin) * yScale;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }, [points, width, height]);

    return <canvas ref={canvasRef} style={{width, height}} />
}
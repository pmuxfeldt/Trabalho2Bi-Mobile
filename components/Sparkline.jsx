import Svg, { Path } from 'react-native-svg';

function generatePoints(code, pctChange, width, height) {
    // Seed determinística: o mesmo `code` sempre gera os mesmos pontos
    const seed = code.split('').reduce((s, c, i) => s + c.charCodeAt(0) * (i + 1), 0);
    const isPositive = parseFloat(pctChange) >= 0;
    const n = 8; // número de pontos do gráfico
    const pts = [];
    let y = height * 0.5; // começa no meio verticalmente

    for (let i = 0; i < n; i++) {
        // Pseudo-random entre 0 e 1, determinístico pela seed
        const r = ((seed * 9301 + 49297 * (i + 1)) % 233280) / 233280;

        const noise = (r - 0.5) * height * 0.4;          // variação aleatória
        const trend = isPositive ? -height * 0.04 : height * 0.04; // direção da tendência

        y = Math.max(2, Math.min(height - 2, y + noise + trend));
        pts.push({ x: (i / (n - 1)) * width, y });
    }
    return pts;
}

function buildSmoothPath(pts) {
    if (!pts.length) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const cpx = ((p0.x + p1.x) / 2).toFixed(1); // ponto de controle horizontal
        d += ` C ${cpx} ${p0.y.toFixed(1)}, ${cpx} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    return d;
}

export function Sparkline({ code, pctChange, width = 64, height = 28, color }) {
    const pts = generatePoints(code, pctChange, width, height);
    const d = buildSmoothPath(pts);
    return (
        <Svg width={width} height={height}>
            <Path
                d={d}
                fill="none"       // apenas a linha, sem preenchimento
                stroke={color}    // cor herdada do componente pai
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </Svg>
    );
}
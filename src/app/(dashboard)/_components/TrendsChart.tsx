"use client";
import * as React from "react";
import { Box, useTheme } from "@mui/material";

type Point = { date: string; count: number };

export default function TrendsChart({ data }: { data: Point[] }) {
  const theme = useTheme();
  const width = 600; // will scale via viewBox
  const height = 160;
  const padding = 16;
  const max = Math.max(1, ...data.map(d => d.count));
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = padding + (height - padding * 2) * (1 - d.count / max);
    return { x, y, d };
  });
  const poly = points.map(p => `${p.x},${p.y}`).join(" ");
  return (
    <Box sx={{ width: '100%', height }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img">
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity="0.25" />
            <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area under curve */}
        {points.length > 1 && (
          <path
            d={`M ${points[0].x},${height - padding} L ${poly} L ${points[points.length-1].x},${height - padding} Z`}
            fill="url(#lineFill)"
            stroke="none"
          />
        )}
        {/* Line */}
        <polyline
          points={poly}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Points */}
        {points.map((p) => (
          <g key={p.d.date}>
            <circle cx={p.x} cy={p.y} r={2.5} fill={theme.palette.primary.main} />
            {/* Optional hover title */}
            <title>{`${p.d.date}: ${p.d.count}`}</title>
          </g>
        ))}
      </svg>
    </Box>
  );
}

"use client";

import { useEffect, useRef } from "react";

// Client location dots [lat, lon]
const DOTS = [
  [1.35, 103.82],   // Singapore
  [3.14, 101.69],   // Kuala Lumpur
  [51.51, -0.13],   // London
  [40.71, -74.01],  // New York
  [35.68, 139.69],  // Tokyo
  [-33.87, 151.21], // Sydney
  [48.85, 2.35],    // Paris
  [55.75, 37.62],   // Moscow
  [19.08, 72.88],   // Mumbai
  [23.13, 113.26],  // Guangzhou
  [-23.55, -46.63], // São Paulo
  [6.52, 3.38],     // Lagos
];

// Latitude/longitude lines config
const LAT_LINES = 12;
const LON_LINES = 18;
const SEGMENTS = 80;

function toRad(deg: number) { return deg * (Math.PI / 180); }

function project(lat: number, lon: number, rotY: number, R: number, cx: number, cy: number) {
  const phi = toRad(lat);
  const theta = toRad(lon) + rotY;
  const x = R * Math.cos(phi) * Math.cos(theta);
  const y = R * Math.sin(phi);
  const z = R * Math.cos(phi) * Math.sin(theta);
  return { sx: cx + x, sy: cy - y, z };
}

export default function Globe3D({ size = 380 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const dragRef = useRef({ dragging: false, lastX: 0 });
  const velRef = useRef(0.003);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const R = size * 0.38;
    const cx = size / 2;
    const cy = size / 2;

    // Pulse state for dots
    let pulseT = 0;

    function draw() {
      ctx.clearRect(0, 0, size, size);

      const rot = rotRef.current;
      pulseT += 0.04;

      // --- Atmospheric glow ---
      const glow = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.35);
      glow.addColorStop(0, "rgba(20,184,166,0.0)");
      glow.addColorStop(0.6, "rgba(20,184,166,0.07)");
      glow.addColorStop(1, "rgba(20,184,166,0.0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // --- Outer decorative ring ---
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(20,184,166,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Second decorative ring ---
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(20,184,166,0.07)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 14]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Collect all line segments with their z value for depth sorting
      const segments: { points: { sx: number; sy: number; z: number }[]; z: number }[] = [];

      // --- Latitude lines ---
      for (let i = 0; i <= LAT_LINES; i++) {
        const lat = -90 + (180 / LAT_LINES) * i;
        const pts: { sx: number; sy: number; z: number }[] = [];
        for (let j = 0; j <= SEGMENTS; j++) {
          const lon = -180 + (360 / SEGMENTS) * j;
          pts.push(project(lat, lon, rot, R, cx, cy));
        }
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
        segments.push({ points: pts, z: avgZ });
      }

      // --- Longitude lines ---
      for (let i = 0; i < LON_LINES; i++) {
        const lon = -180 + (360 / LON_LINES) * i;
        const pts: { sx: number; sy: number; z: number }[] = [];
        for (let j = 0; j <= SEGMENTS; j++) {
          const lat = -90 + (180 / SEGMENTS) * j;
          pts.push(project(lat, lon, rot, R, cx, cy));
        }
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
        segments.push({ points: pts, z: avgZ });
      }

      // Draw all lines
      for (const seg of segments) {
        ctx.beginPath();
        let started = false;
        for (const p of seg.points) {
          const visible = p.z >= 0;
          if (visible) {
            if (!started) { ctx.moveTo(p.sx, p.sy); started = true; }
            else ctx.lineTo(p.sx, p.sy);
          } else {
            // Draw faded back lines
            if (started) {
              ctx.strokeStyle = "rgba(20,184,166,0.06)";
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.beginPath();
              started = false;
            }
            ctx.moveTo(p.sx, p.sy);
          }
        }
        if (started) {
          ctx.strokeStyle = "rgba(20,184,166,0.35)";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // --- Equator highlight ---
      ctx.beginPath();
      let equatorStarted = false;
      for (let j = 0; j <= SEGMENTS * 2; j++) {
        const lon = -180 + (360 / (SEGMENTS * 2)) * j;
        const p = project(0, lon, rot, R, cx, cy);
        if (p.z >= 0) {
          if (!equatorStarted) { ctx.moveTo(p.sx, p.sy); equatorStarted = true; }
          else ctx.lineTo(p.sx, p.sy);
        } else {
          if (equatorStarted) {
            ctx.strokeStyle = "rgba(20,184,166,0.5)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.beginPath();
            equatorStarted = false;
          }
          ctx.moveTo(p.sx, p.sy);
        }
      }
      if (equatorStarted) {
        ctx.strokeStyle = "rgba(20,184,166,0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // --- Glowing client dots ---
      for (const [lat, lon] of DOTS) {
        const p = project(lat, lon, rot, R, cx, cy);
        if (p.z < -R * 0.15) continue; // hide dots on back

        const alpha = p.z >= 0 ? 1 : Math.max(0, 1 + p.z / (R * 0.15));
        const pulse = Math.sin(pulseT + lat * 0.1) * 0.5 + 0.5; // unique pulse per dot

        // Outer glow ring
        const glowR = (3 + pulse * 5);
        const dotGlow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowR);
        dotGlow.addColorStop(0, `rgba(20,184,166,${0.8 * alpha})`);
        dotGlow.addColorStop(1, `rgba(20,184,166,0)`);
        ctx.fillStyle = dotGlow;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      // --- Center sphere subtle fill ---
      const sphereFill = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
      sphereFill.addColorStop(0, "rgba(20,184,166,0.04)");
      sphereFill.addColorStop(1, "rgba(0,0,0,0.0)");
      ctx.fillStyle = sphereFill;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Auto-rotate
      rotRef.current += velRef.current;
      frameRef.current = requestAnimationFrame(draw);
    }

    // Mouse drag to rotate
    const handleMouseDown = (e: MouseEvent) => {
      dragRef.current = { dragging: true, lastX: e.clientX };
      velRef.current = 0;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.lastX;
      rotRef.current += dx * 0.005;
      velRef.current = dx * 0.002;
      dragRef.current.lastX = e.clientX;
    };
    const handleMouseUp = () => {
      dragRef.current.dragging = false;
      if (Math.abs(velRef.current) < 0.001) velRef.current = 0.003;
    };

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      dragRef.current = { dragging: true, lastX: e.touches[0].clientX };
      velRef.current = 0;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.dragging) return;
      const dx = e.touches[0].clientX - dragRef.current.lastX;
      rotRef.current += dx * 0.005;
      velRef.current = dx * 0.002;
      dragRef.current.lastX = e.touches[0].clientX;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [size]);

  return (
    <div className="relative flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        className="cursor-grab active:cursor-grabbing"
        style={{ width: size, height: size }}
      />
      {/* Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-teal-500/60 font-medium tracking-widest uppercase pointer-events-none">
        Drag to rotate
      </div>
    </div>
  );
}

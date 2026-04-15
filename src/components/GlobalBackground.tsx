"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   PERFORMANCE-OPTIMISED global background.

   Key rules:
   ① filter:blur lives on a STATIC outer div — never recomputed during animation
   ② motion.div only animates transform (x/y/scale) — GPU compositor handles it
   ③ mouse events are RAF-throttled — one DOM write per frame maximum
   ④ 4 blobs instead of 6, smaller sizes, reduced blur radius
───────────────────────────────────────────────────────────────────────────── */

const BLOBS = [
  { id: 0, rgb: "20,184,166",  light: 0.14, dark: 0.24, size: 700, x: 6,  floatX: 80,  floatY: 90,  dur: 22, del: 0,  scroll: 0.12 },
  { id: 1, rgb: "245,158,11",  light: 0.10, dark: 0.18, size: 580, x: 72, floatX: 100, floatY: 70,  dur: 28, del: 5,  scroll: 0.22 },
  { id: 2, rgb: "139,92,246",  light: 0.08, dark: 0.15, size: 520, x: 42, floatX: 70,  floatY: 85,  dur: 33, del: 11, scroll: 0.16 },
  { id: 3, rgb: "20,184,166",  light: 0.10, dark: 0.20, size: 640, x: 80, floatX: 85,  floatY: 65,  dur: 26, del: 3,  scroll: 0.28 },
] as const;

export default function GlobalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 55,
        y: (e.clientY / window.innerHeight - 0.5) * 55,
      };
      // Throttle to one DOM write per animation frame
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!containerRef.current) return;
        const blobs = containerRef.current.querySelectorAll<HTMLElement>("[data-blob]");
        blobs.forEach((blob, i) => {
          const f = (i % 3 + 1) * 0.16;
          blob.style.transform = `translate(${mouseRef.current.x * f}px, ${mouseRef.current.y * f}px)`;
        });
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
    >
      {/* Base colour */}
      <div className="absolute inset-0 bg-[#f5f3ef] dark:bg-[#080808] transition-colors duration-700" />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {BLOBS.map((blob) => (
        <AnimatedBlob key={blob.id} blob={blob} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

function AnimatedBlob({
  blob,
  scrollYProgress,
}: {
  blob: (typeof BLOBS)[number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const scrollY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(typeof window !== "undefined" ? window.innerHeight : 900) * blob.scroll]
  );

  return (
    /*
     * ① OUTER div: static position + blur — never animated, so blur cost is
     *   paid once when the element is promoted to a compositing layer, not
     *   re-calculated every frame.
     */
    <div
      style={{
        position: "absolute",
        width:  blob.size,
        height: blob.size,
        left:   `calc(${blob.x}% - ${blob.size / 2}px)`,
        top:    `calc(${18 + blob.id * 18}vh - ${blob.size / 2}px)`,
        filter: "blur(55px)",       // ← static, never changes
        willChange: "transform",    // ← hint browser to promote layer
      }}
    >
      {/*
       * ② INNER motion.div: only transform properties (x/y/scale) +
       *   scroll-linked translateY.  GPU compositor handles all of this
       *   without touching the blur layer above.
       */}
      <motion.div
        data-blob
        className="absolute inset-0 rounded-full"
        style={{ y: scrollY }}
        animate={{
          x:     [0,  blob.floatX,  -blob.floatX * 0.55, blob.floatX * 0.35, 0],
          y:     [0, -blob.floatY,   blob.floatY * 0.45, -blob.floatY * 0.25, 0],
          scale: [1,  1.07,          0.96,                1.03,               1],
        }}
        transition={{
          duration: blob.dur,
          delay:    blob.del,
          repeat:   Infinity,
          ease:     "easeInOut",
          times:    [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        {/* Light mode */}
        <div
          className="absolute inset-0 rounded-full dark:hidden"
          style={{ background: `radial-gradient(circle at 40% 40%, rgba(${blob.rgb},${blob.light}), transparent 70%)` }}
        />
        {/* Dark mode */}
        <div
          className="absolute inset-0 rounded-full hidden dark:block"
          style={{ background: `radial-gradient(circle at 40% 40%, rgba(${blob.rgb},${blob.dark}), transparent 70%)` }}
        />
      </motion.div>
    </div>
  );
}

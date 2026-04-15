"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   ONE unified interactive background that spans the entire page.
   - 6 large soft blobs that float continuously
   - Mouse pointer causes the nearest blobs to drift toward it (subtle)
   - Scroll makes different blobs move at different parallax speeds
   - Works in light + dark mode
───────────────────────────────────────────────────────────────────────────── */

const BLOBS = [
  // { color rgb, light-opacity, dark-opacity, size px, start x%, float range px, duration s, delay s, scroll factor }
  { id: 0, rgb: "20,184,166",  light: 0.13, dark: 0.22, size: 920, x: 8,  floatX: 90,  floatY: 110, dur: 22, del: 0,  scroll: 0.12 },
  { id: 1, rgb: "245,158,11",  light: 0.09, dark: 0.16, size: 700, x: 76, floatX: 110, floatY: 80,  dur: 28, del: 5,  scroll: 0.22 },
  { id: 2, rgb: "139,92,246",  light: 0.07, dark: 0.14, size: 620, x: 44, floatX: 75,  floatY: 95,  dur: 33, del: 11, scroll: 0.16 },
  { id: 3, rgb: "20,184,166",  light: 0.10, dark: 0.20, size: 780, x: 83, floatX: 95,  floatY: 75,  dur: 26, del: 3,  scroll: 0.28 },
  { id: 4, rgb: "245,158,11",  light: 0.08, dark: 0.15, size: 840, x: 4,  floatX: 85,  floatY: 105, dur: 31, del: 9,  scroll: 0.08 },
  { id: 5, rgb: "20,184,166",  light: 0.09, dark: 0.18, size: 660, x: 58, floatX: 105, floatY: 65,  dur: 20, del: 15, scroll: 0.34 },
] as const;

export default function GlobalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  // Mouse tracking — move blobs very subtly toward cursor
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 60,
        y: (e.clientY / window.innerHeight - 0.5) * 60,
      };
      if (!containerRef.current) return;
      const blobs = containerRef.current.querySelectorAll<HTMLElement>("[data-blob]");
      blobs.forEach((blob, i) => {
        const factor = (i % 3 + 1) * 0.18;
        blob.style.transform = `translate(${mouseRef.current.x * factor}px, ${mouseRef.current.y * factor}px)`;
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
    >
      {/* Base gradient — matches light/dark body color */}
      <div className="absolute inset-0 bg-[#f5f3ef] dark:bg-[#080808] transition-colors duration-700" />

      {/* Noise grain overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Animated blobs */}
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
  blob: typeof BLOBS[number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each blob moves up at a different speed as the page scrolls
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(typeof window !== "undefined" ? window.innerHeight : 900) * blob.scroll]
  );

  return (
    <motion.div
      data-blob
      className="absolute rounded-full will-change-transform"
      style={{
        width: blob.size,
        height: blob.size,
        left: `calc(${blob.x}% - ${blob.size / 2}px)`,
        top: `calc(${20 + blob.id * 14}vh - ${blob.size / 2}px)`,
        filter: "blur(80px)",
        y,
      }}
      animate={{
        x: [0, blob.floatX, -blob.floatX * 0.6, blob.floatX * 0.4, 0],
        y: [0, -blob.floatY, blob.floatY * 0.5, -blob.floatY * 0.3, 0],
        scale: [1, 1.08, 0.96, 1.04, 1],
      }}
      transition={{
        duration: blob.dur,
        delay: blob.del,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    >
      {/* Light mode blob — hidden in dark mode */}
      <div
        className="absolute inset-0 rounded-full dark:hidden"
        style={{
          background: `radial-gradient(circle at 40% 40%, rgba(${blob.rgb},${blob.light}), transparent 70%)`,
        }}
      />
      {/* Dark mode blob — hidden in light mode */}
      <div
        className="absolute inset-0 rounded-full hidden dark:block"
        style={{
          background: `radial-gradient(circle at 40% 40%, rgba(${blob.rgb},${blob.dark}), transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

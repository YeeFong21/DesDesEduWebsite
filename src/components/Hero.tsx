"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/data";
import Globe3D from "./Globe3D";

// ── Topographic SVG background ───────────────────────────────────────────────
function TopoBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="topo" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
          <path d="M120,15 C155,15 185,40 192,75 C199,110 187,145 164,163 C141,181 108,185 78,170 C48,155 28,122 32,88 C36,54 60,28 92,18 C101,16 110,15 120,15Z" fill="none" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M120,38 C148,38 172,58 177,86 C182,114 170,140 150,154 C130,168 104,170 82,158 C60,146 46,122 52,96 C58,70 82,50 108,42 C112,40 116,38 120,38Z" fill="none" stroke="currentColor" strokeWidth="1"/>
          <path d="M120,62 C140,62 158,76 161,98 C164,120 152,142 134,152 C116,162 94,160 78,150 C62,140 56,120 62,100 C68,80 90,64 120,62Z" fill="none" stroke="currentColor" strokeWidth="0.8"/>
          <circle cx="120" cy="120" r="28" fill="none" stroke="currentColor" strokeWidth="0.7"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)"/>
    </svg>
  );
}

// ── Floating particles ────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-teal-400/20 dark:bg-teal-400/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -60, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Magnetic button ───────────────────────────────────────────────────────────
function MagneticButton({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setPos({ x, y });
  };
  const handleLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.a
      ref={btnRef}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold overflow-hidden transition-shadow hover:shadow-xl ${
        dark
          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-gray-900/30"
          : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
      }`}
    >
      {dark && (
        <span className="absolute inset-0 bg-teal-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.a>
  );
}

// ── Cursor spotlight ──────────────────────────────────────────────────────────
function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)", transition: "left 0.12s ease, top 0.12s ease" }}
    />
  );
}

// ── Animated headline ─────────────────────────────────────────────────────────
function AnimatedHeadline({ text }: { text: string }) {
  return (
    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white">
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="inline-block mr-[0.25em]"
        >
          {word === "&" ? <span className="text-teal-500">&amp;</span> : word}
        </motion.span>
      ))}
    </h1>
  );
}

const stats = [
  { value: "500+", label: "Clients" },
  { value: "4.9★", label: "Rating" },
  { value: "5yr", label: "Experience" },
  { value: "98%", label: "Satisfaction" },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={containerRef} id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <CursorSpotlight />
      <TopoBackground />
      <Particles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full relative z-10">
        <motion.div style={{ y, opacity }} className="grid lg:grid-cols-5 gap-8 items-center">

          {/* ── Left ── */}
          <div className="lg:col-span-3 flex flex-col gap-8">

            {/* Live badge */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Now accepting new clients</span>
            </motion.div>

            <AnimatedHeadline text={siteConfig.tagline} />

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              {siteConfig.description} Every session is personalised — no generic advice, just real guidance built around your goals.
            </motion.p>

            {/* CTA buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex flex-wrap gap-4">
              <MagneticButton href={siteConfig.contactLink} dark>
                Book Free Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton href="#services">
                See Services
              </MagneticButton>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-8 pt-4 border-t border-gray-200 dark:border-gray-800">
              {stats.map(({ value, label }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1 }} className="flex flex-col">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{value}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right — Globe ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="hidden lg:flex lg:col-span-2 flex-col items-center gap-4"
          >
            {/* Globe label */}
            <div className="flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 font-semibold tracking-widest uppercase">
              <span className="w-4 h-px bg-teal-500" />
              Clients Worldwide
              <span className="w-4 h-px bg-teal-500" />
            </div>

            {/* Globe */}
            <div className="relative">
              <Globe3D size={340} />

              {/* Floating stat cards around the globe */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute -top-3 -right-8 bg-amber-400 text-amber-900 text-xs font-black px-4 py-2 rounded-full shadow-xl shadow-amber-400/30"
              >
                ⭐ 4.9 / 5.0
              </motion.div>

              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-3 -left-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-3 flex items-center gap-2.5 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex -space-x-1.5">
                  {["bg-teal-500", "bg-purple-500", "bg-amber-500"].map((c, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white dark:border-gray-900`} />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">500+ clients</p>
                  <p className="text-[10px] text-gray-400">across the globe</p>
                </div>
              </motion.div>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
              Drag the globe to explore · Online sessions worldwide
            </p>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-5 h-8 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" />
        </motion.div>
        <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}

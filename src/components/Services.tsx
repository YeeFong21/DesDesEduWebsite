"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Briefcase, GraduationCap, Star, Target, Sparkles, ArrowUpRight } from "lucide-react";
import { services } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = { Briefcase, GraduationCap, Star, Target };

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); setHovered(false); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className={`relative cursor-default ${className}`}
    >
      {/* Spotlight */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity"
          style={{ background: "radial-gradient(280px circle at var(--x,50%) var(--y,50%), rgba(20,184,166,0.14), transparent 80%)" }}
        />
      )}
      {children}
    </motion.div>
  );
}

const bentoConfig = [
  { span: "lg:col-span-2 lg:row-span-2", big: true },
  { span: "lg:col-span-1", big: false },
  { span: "lg:col-span-1", big: false },
  { span: "lg:col-span-2", big: false },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white dark:bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-600 dark:text-teal-400 mb-3 block">What I Offer</span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Services Built<br />Around <span className="text-teal-500">You</span>
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs text-sm leading-relaxed">
            Every session is personalised — no cookie-cutter advice, just real, actionable guidance.
          </p>
        </motion.div>

        {/* Bento grid with 3D tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[210px]" style={{ perspective: "1000px" }}>
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Star;
            const config = bentoConfig[i] || bentoConfig[0];

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={config.span}
              >
                <TiltCard className="h-full">
                  <div className="h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 hover:border-teal-300 dark:hover:border-teal-700 transition-colors duration-300 group overflow-hidden">
                    <div className="h-full p-6 flex flex-col justify-between relative">
                      {/* Gradient shine on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-gradient-to-br from-teal-50/50 via-transparent to-transparent dark:from-teal-900/10" />

                      <div className="relative z-10">
                        <div className={`inline-flex items-center justify-center rounded-xl mb-4 ${config.big ? "w-14 h-14" : "w-11 h-11"} bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 group-hover:scale-110 transition-all duration-300`}>
                          <Icon className={config.big ? "w-7 h-7" : "w-5 h-5"} />
                        </div>
                        <h3 className={`font-bold text-gray-900 dark:text-white mb-2 ${config.big ? "text-2xl" : "text-lg"}`}>
                          {service.title}
                        </h3>
                        <p className={`text-gray-500 dark:text-gray-400 leading-relaxed ${config.big ? "text-base" : "text-sm"}`}>
                          {service.description}
                        </p>
                      </div>

                      <div className="relative z-10 flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 mt-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Book this service
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

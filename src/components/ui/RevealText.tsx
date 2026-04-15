"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Word-by-word scroll reveal
 * Each word fades + rises as the section scrolls into view.
 */
export function RevealText({
  text,
  className = "",
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end   = (i + 1) / words.length;
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </Tag>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y       = useTransform(progress, range, [10, 0]);

  return (
    <span className="inline-block mr-[0.28em] overflow-hidden">
      {/* Only opacity + y — both GPU-accelerated, no blur */}
      <motion.span className="inline-block" style={{ opacity, y }}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * FadeUp — opacity + y + scale only (no blur)
 */
export function FadeUp({
  children,
  delay    = 0,
  duration = 0.65,
  className = "",
  distance = 50,
}: {
  children:  React.ReactNode;
  delay?:    number;
  duration?: number;
  className?: string;
  distance?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideIn — opacity + x only (no blur)
 */
export function SlideIn({
  children,
  from   = "left",
  delay  = 0,
  className = "",
}: {
  children:  React.ReactNode;
  from?:     "left" | "right";
  delay?:    number;
  className?: string;
}) {
  const x = from === "left" ? -50 : 50;
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScalePop — opacity + scale (no blur)
 */
export function ScalePop({
  children,
  delay  = 0,
  className = "",
}: {
  children:  React.ReactNode;
  delay?:    number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer — triggers child variants in sequence
 */
export function StaggerContainer({
  children,
  stagger = 0.1,
  className = "",
  style,
}: {
  children:  React.ReactNode;
  stagger?:  number;
  className?: string;
  style?:    React.CSSProperties;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** Variant pair used by StaggerContainer children — no blur */
export const staggerItem = {
  hidden:  { opacity: 0, y: 50, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

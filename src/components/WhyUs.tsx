"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { siteConfig } from "@/lib/data";

// Animated number counter
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = to / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [isInView, to]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const stats = [
  { to: 500, suffix: "+", label: "Clients Helped" },
  { to: 5, suffix: "+", label: "Years Experience" },
  { to: 98, suffix: "%", label: "Satisfaction Rate" },
  { to: 3, suffix: "x", label: "Goal Achievement" },
];

const reasons = [
  "Personalised 1-on-1 sessions tailored to your specific needs",
  "Proven frameworks used by top coaches and counselors",
  "Flexible scheduling — online sessions, any timezone",
  "Confidential, judgement-free space to explore your goals",
  "Actionable plans, not just vague advice",
  "Free 15-minute discovery call before committing",
];

export default function WhyUs() {
  return (
    <section id="about" className="py-24 bg-[#0d0d0d] dark:bg-[#0d0d0d] relative overflow-hidden">

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-teal-900/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Animated stat counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-800/50 rounded-3xl overflow-hidden mb-20 border border-gray-800">
          {stats.map(({ to, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-950 p-8 text-center"
            >
              <p className="text-4xl lg:text-5xl font-black text-white mb-2">
                <Counter to={to} suffix={suffix} />
              </p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* About + reasons */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-500 mb-4 block">
              Why Choose Me
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Guidance You Can{" "}
              <span className="text-teal-400">Actually Trust</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
              Hi, I&apos;m {siteConfig.name}. With over 5 years of experience helping
              students and professionals navigate life&apos;s challenges, I bring both
              expertise and genuine care to every session. My approach is practical,
              empathetic, and results-focused.
            </p>
            <a
              href={siteConfig.contactLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-teal-900/50"
            >
              Start Your Journey →
            </a>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-teal-800 transition-colors group"
              >
                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{reason}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

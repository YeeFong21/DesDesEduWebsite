"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/data";
import { FadeUp, RevealText } from "@/components/ui/RevealText";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400" : "text-gray-300 dark:text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const avatarColors = ["from-teal-400 to-teal-700", "from-purple-400 to-purple-700", "from-amber-400 to-amber-600", "from-blue-400 to-blue-700"];
const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

function TestimonialCard({ t, i }: { t: typeof testimonials[0]; i: number }) {
  return (
    <div className="flex-shrink-0 w-[320px] mx-3 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <StarRating rating={t.rating} />
      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-xs`}>
          {t.name[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <FadeUp delay={0} distance={40}>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-600 dark:text-teal-400 mb-3 block">
              Client Stories
            </span>
          </FadeUp>
          <RevealText
            text="Real Results, Real People"
            as="h2"
            className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white"
          />
          <FadeUp delay={0.3} distance={30} className="mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
              Hear from people who have transformed their lives through counseling.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden mb-4">
          <motion.div
            className="flex"
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {allTestimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} i={i} />
            ))}
          </motion.div>
        </div>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: ["-33.33%", "0%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {allTestimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} i={i + 1} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

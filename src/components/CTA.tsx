"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { FadeUp, ScalePop, RevealText } from "@/components/ui/RevealText";

export default function CTA() {
  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <ScalePop>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-800 dark:to-teal-950 p-12 text-center">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Animated ring pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0, 0.08] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-[500px] h-[500px] rounded-full border border-white/20"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <FadeUp delay={0.1} distance={30}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Limited spots available
                </div>
              </FadeUp>

              <RevealText
                text="Ready to Transform Your Life?"
                as="h2"
                className="text-3xl sm:text-4xl font-bold text-white"
              />

              <FadeUp delay={0.2} distance={30}>
                <p className="text-teal-100 text-lg leading-relaxed">
                  Take the first step today. Book a free 15-minute discovery call —
                  no pressure, no commitment. Just a conversation about your goals.
                </p>
              </FadeUp>

              <FadeUp delay={0.35} distance={25}>
                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.a
                    href={siteConfig.contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-teal-700 font-bold hover:bg-teal-50 transition-colors shadow-lg"
                  >
                    Book Free Consultation
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    href={`mailto:${siteConfig.email}`}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send a Message
                  </motion.a>
                </div>
              </FadeUp>

              <FadeUp delay={0.45} distance={20}>
                <p className="text-teal-200 text-sm">
                  Usually replies within a few hours ·{" "}
                  <a href={`mailto:${siteConfig.email}`} className="underline hover:text-white transition-colors">
                    {siteConfig.email}
                  </a>
                </p>
              </FadeUp>
            </div>
          </div>
        </ScalePop>

      </div>
    </section>
  );
}

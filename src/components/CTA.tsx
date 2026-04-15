"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/data";

export default function CTA() {
  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-800 dark:to-teal-950 p-12 text-center"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Limited spots available
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Transform Your Life?
            </h2>

            <p className="text-teal-100 text-lg leading-relaxed">
              Take the first step today. Book a free 15-minute discovery call —
              no pressure, no commitment. Just a conversation about your goals.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={siteConfig.contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-teal-700 font-bold hover:bg-teal-50 transition-all hover:scale-105 shadow-lg"
              >
                Book Free Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Send a Message
              </a>
            </div>

            <p className="text-teal-200 text-sm">
              Usually replies within a few hours ·{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline hover:text-white transition-colors">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

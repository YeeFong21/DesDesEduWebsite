import { GraduationCap } from "lucide-react";
import { siteConfig } from "@/lib/data";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <a href="#home" className="flex items-center gap-2 text-white font-bold text-lg">
              <GraduationCap className="w-6 h-6 text-teal-400" />
              {siteConfig.name}
            </a>
            <p className="text-sm leading-relaxed">
              Professional counseling to help you find clarity, confidence, and direction.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm">Navigation</p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm">Get in Touch</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-teal-400 transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={siteConfig.social.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                  Telegram
                </a>
              </li>
              <li>
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Built with Next.js & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}

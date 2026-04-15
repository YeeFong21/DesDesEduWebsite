import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import GlobalBackground from "@/components/GlobalBackground";

export default function Home() {
  return (
    <main>
      <GlobalBackground />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

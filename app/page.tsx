import { site } from "@/site.config";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Băng thông báo trên cùng */}
      <div className="bg-bg-deep px-4 py-2.5 text-center text-[13.5px] font-bold text-white">
        {site.announcement}
      </div>

      <Header />

      <main>
        <Hero />
        <Marquee />
        <Gallery />
        <About />
        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}

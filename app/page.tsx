import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import BannerStrip from "@/components/BannerStrip";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        {/* Băng chữ chạy nằm ngay dưới banner đầu trang, trên phần "Khám phá" */}
        <Marquee />
        <BannerStrip />
        <Gallery />
        <About />
        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileCtaBar from "@/components/layout/MobileCtaBar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import MenuPreview from "@/components/sections/MenuPreview";
import Recommend from "@/components/sections/Recommend";
import Price from "@/components/sections/Price";
import Gallery from "@/components/sections/Gallery";
import Scene from "@/components/sections/Scene";
import Access from "@/components/sections/Access";
import Reservation from "@/components/sections/Reservation";
import Voice from "@/components/sections/Voice";
import Marquee from "@/components/ui/Marquee";
import JsonLd from "@/components/ui/JsonLd";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <MenuPreview />
        <Recommend />
        <Price />
        <Gallery />
        <Marquee tone="yellow" />
        <Scene />
        <Voice />
        <Access />
        <Reservation />
      </main>
      <Footer />
      <MobileCtaBar />
      <JsonLd />
    </>
  );
}

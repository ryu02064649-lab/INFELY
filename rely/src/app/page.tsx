import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileRequestBar from "@/components/layout/MobileRequestBar";
import Hero from "@/components/sections/Hero";
import Concept from "@/components/sections/Concept";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import Example from "@/components/sections/Example";
import Pricing from "@/components/sections/Pricing";
import About from "@/components/sections/About";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Concept />
        <Services />
        <HowItWorks />
        <Example />
        <Pricing />
        <About />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileRequestBar />
    </>
  );
}

import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Engagements from "@/components/site/Engagements";
import Prestations from "@/components/site/Prestations";
import Galerie from "@/components/site/Galerie";
import APropos from "@/components/site/APropos";
import Methode from "@/components/site/Methode";
import Avis from "@/components/site/Avis";
import Faq from "@/components/site/Faq";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import DemoBanner from "@/components/site/DemoBanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Engagements />
      <Prestations />
      <Galerie />
      <APropos />
      <Methode />
      <Avis />
      <Faq />
      <Contact />
      <Footer />
      <DemoBanner />
    </>
  );
}

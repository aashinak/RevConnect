import Footer from "@/components/Home/footer";
import HeroSection from "@/components/Home/heroSection";
import Navbar from "@/components/Home/navbar";
import SubHero from "@/components/Home/subHero";
import Wraper from "@/components/Home/wraper";


export default function Home() {
  return (
    <Wraper>
      <Navbar/>
      <HeroSection/>
      <SubHero/>
      <Footer/>
    </Wraper>
  );
}

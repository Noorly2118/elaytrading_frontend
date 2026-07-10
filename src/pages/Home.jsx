import HeroSection from "../components/Home/HeroSection";
import CategorySection from "../components/Home/CategorySection";
import FeaturedProducts from "../components/Home/FeaturedProducts";
import TrustSection from "../components/Home/TrustSection";
import BrandsSection from "../components/Home/BrandsSection";
import CTASection from "../components/Home/CTASection";
import toast from "react-hot-toast";

const Home = () => {
  return (
    <>
  
      <HeroSection />
        
      <CategorySection />
      <TrustSection />
      <BrandsSection />
      <CTASection />
    </>
  );
};

export default Home;

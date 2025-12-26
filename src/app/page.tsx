import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import BestSellers from "@/components/home/BestSellers";
import WhyOurTea from "@/components/home/WhyOurTea";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <WhyOurTea />
      <Testimonials />
      <Newsletter />
    </>
  );
}

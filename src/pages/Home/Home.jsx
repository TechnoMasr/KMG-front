import Hero from "./sections/Hero";
import ServicesSection from "./sections/ServicesSection";
import Testimonials from "./sections/Testimonials";
import OrderMethod from "./sections/OrderMethod";
import DiscoverByPlatform from "./sections/DiscoverByPlatform";
import { useQuery } from "@tanstack/react-query";
import { getHome } from "@/api/homeServices";
import SeoManager from "@/utils/SeoManager";

const Home = () => {
  const { data: homeData, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: getHome,
  });

  const seo = homeData?.home_seo;

  return (
    <>
      <SeoManager
        title={seo?.meta_title}
        description={seo?.meta_description}
        keywords={seo?.keywords}
        canonical={seo?.canonical_url}
        ogImage={seo?.og_image}
      />

      <article>
        <Hero data={homeData?.sliders} isLoading={isLoading} />
        <ServicesSection />
        <Testimonials data={homeData?.testimonials} isLoading={isLoading} />
        <OrderMethod data={homeData?.order_ways} isLoading={isLoading} />
        <DiscoverByPlatform data={homeData?.platforms} isLoading={isLoading} />
      </article>
    </>
  );
};

export default Home;

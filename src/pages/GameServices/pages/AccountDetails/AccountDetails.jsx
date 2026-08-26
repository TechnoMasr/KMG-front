import HeadSection from "./section/HeadSection";
import OfferDetails from "./section/OfferDetails";
import FAQ from "@/components/commonSections/FAQ";
import PurchaseSteps from "@/components/commonSections/PurchaseSteps";
import { useParams } from "react-router";
import { getProductsDetails } from "@/api/serviceServices";
import { useQuery } from "@tanstack/react-query";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import OfferDetailsSkeleton from "@/components/Loading/SkeletonLoading/OfferDetailsSkeleton";
import HeadSectionSkeleton from "@/components/Loading/SkeletonLoading/HeadSectionSkeleton";
import SeoManager from "@/utils/SeoManager";

const AccountDetails = () => {
  const { id } = useParams();

  const { data: productDetailsData, isLoading } = useQuery({
    queryKey: ["product-details", id],
    queryFn: () => getProductsDetails(id),
  });

  if (isLoading) {
    return (
      <section className="container py-6 lg:py-10 space-y-8 lg:space-y-16">
        <HeadSectionSkeleton />
        <OfferDetailsSkeleton />
      </section>
    );
  }

  if (!productDetailsData) return <EmptyDataSection />;

  return (
    <>
      <SeoManager
        title={productDetailsData?.seo?.meta_title}
        description={productDetailsData?.seo?.meta_description}
        keywords={productDetailsData?.seo?.keywords}
        canonical={productDetailsData?.seo?.canonical_url}
        ogImage={productDetailsData?.seo?.og_image}
      />

      <section className="container py-6 lg:py-10 space-y-8 lg:space-y-16">
        <HeadSection data={productDetailsData} />

        <OfferDetails data={productDetailsData} />

        <PurchaseSteps />

        <FAQ />
      </section>
    </>
  );
};

export default AccountDetails;

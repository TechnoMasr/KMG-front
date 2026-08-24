import { useState } from "react";
import OffersList from "../../sections/OffersList";
import PaymentCard from "../../sections/PaymentCard";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";

const ProductsPage = ({
  game,
  products = [],
  meta,
  currentPage,
  onPageChange,
}) => {
  const [currentOffer, setCurrentOffer] = useState(null);

  const handleOfferClick = (offer) => {
    if (currentOffer?.id === offer?.id) setCurrentOffer(null);
    else setCurrentOffer(offer);
  };

  return (
    <article className="container py-6 lg:py-10 space-y-6">
      <section className="flex flex-col md:flex-row justify-center gap-8">
        <OffersList
          onOfferClick={handleOfferClick}
          currentOffer={currentOffer}
          offers={products}
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />

        <PaymentCard currentOffer={currentOffer} game={game} />
      </section>
    </article>
  );
};

export default ProductsPage;

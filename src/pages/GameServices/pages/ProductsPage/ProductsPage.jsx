import { useState } from "react";
import OffersCard from "@/components/cards/OffersCard";
import MainPagination from "@/components/common/MainPagination";
import PaymentCard from "../../sections/PaymentCard";

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
    <article className="container space-y-6">
      <section className="flex flex-col md:flex-row justify-center gap-8">
        <div className="space-y-6">
          {!products || products.length === 0 ? (
            <EmptyDataSection />
          ) : (
            <div className="flex flex-wrap justify-center gap-4 h-fit">
              {products?.map((item) => (
                <OffersCard
                  key={item.id}
                  item={item}
                  currentOffer={currentOffer}
                  onOfferClick={handleOfferClick}
                />
              ))}
            </div>
          )}

          <MainPagination
            totalPages={meta?.last_page || 1}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>

        <PaymentCard currentOffer={currentOffer} game={game} />
      </section>
    </article>
  );
};

export default ProductsPage;

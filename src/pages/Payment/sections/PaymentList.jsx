import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import PaymentListSkeleton from "@/components/Loading/SkeletonLoading/PaymentListSkeleton";
import { getPaymentSettings } from "@/services/paymentsServices";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const PaymentList = ({ onPaymentClick, currentPayment }) => {
  const { t } = useTranslation();

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ["payment-settings"],
    queryFn: getPaymentSettings,
  });

  if (isLoading) return <PaymentListSkeleton />;

  if (!paymentData || paymentData.length === 0)
    return <EmptyDataSection msg={t("PaymentList.noPaymentMethods")} />;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 text-center">
        {t("PaymentList.choosePaymentMethod")}
      </h3>

      <div className="grid grid-cols-2 gap-4 h-fit">
        {paymentData?.map((item) => (
          <div
            key={item.id}
            onClick={() => onPaymentClick(item)}
            className={`card flex flex-col w-[150px] items-center text-center gap-2 cursor-pointer hover:scale-102 duration-200 ${
              item?.id === currentPayment?.id ? "border-primary border-2" : ""
            }`}
          >
            <div className="w-full aspect-video bg-accent rounded-md overflow-hidden">
              <img
                loading="lazy"
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentList;

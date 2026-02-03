import SectionTitle from "@/components/common/SectionTitle";
import { getPurchaseSteps } from "@/services/mainServices";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiCreditCard, FiPackage } from "react-icons/fi";
import PurchaseStepsSkeleton from "../Loading/SkeletonLoading/PurchaseStepsSkeleton";
import { useTranslation } from "react-i18next";

const PurchaseSteps = () => {
  const { t } = useTranslation();

  const { data: purchaseStepsData, isLoading } = useQuery({
    queryKey: ["purchase-steps"],
    queryFn: getPurchaseSteps,
  });

  if (isLoading) {
    return <PurchaseStepsSkeleton />;
  }

  if (!purchaseStepsData?.length || purchaseStepsData.length === 0) {
    return null;
  }

  const icons = [FiSearch, FiCreditCard, FiPackage];

  const list = purchaseStepsData.map((item, index) => {
    const Icon = icons[index] || FiPackage;

    return {
      id: index + 1,
      title: item.title,
      description: item.description,
      icon: <Icon size={28} />,
    };
  });

  return (
    <div>
      <SectionTitle title={t("PurchaseSteps.sectionTitle")} />

      <div className="flex flex-wrap gap-4 lg:gap-8">
        {list.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center gap-2 card relative flex-1 min-w-[200px]"
          >
            <span className="absolute top-2 start-4 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full border">
              {index + 1}
            </span>

            <h2 className="bg-primary rounded-xl w-16 h-16 flex items-center justify-center text-4xl font-bold shadow-lg shadow-accent-foreground/20 mb-4">
              {item.icon}
            </h2>

            <h3 className="text-2xl font-bold">{item.title}</h3>
            <p className="text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseSteps;

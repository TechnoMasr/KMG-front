import emptyIcon from "@/assets/icons/Empty-img.png";
import { useTranslation } from "react-i18next";

const EmptyDataSection = ({ msg }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <img
        loading="lazy"
        src={emptyIcon}
        alt="Empty data"
        className="mx-auto w-52 lg:w-72"
      />

      <p className="text-center font-semibold text-lg">
        {msg || t("EmptyDataSection.defaultMessage")}
      </p>
    </div>
  );
};

export default EmptyDataSection;

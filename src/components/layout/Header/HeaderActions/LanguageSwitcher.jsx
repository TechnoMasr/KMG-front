import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "@/store/languageSlice/languageSlice";
import LoadingModal from "@/components/Loading/LoadingModal";
import { FaGlobe } from "react-icons/fa";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const { lang } = useSelector((state) => state.language);

  const [openLoading, setOpenLoading] = useState(false);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const handleChangeLanguage = (value) => {
    if (value !== lang) {
      dispatch(changeLanguage(value));
      setOpenLoading(true);
    }
  };

  return (
    <>
      <Select value={lang} onValueChange={handleChangeLanguage}>
        <SelectTrigger className="min-w-fit rounded-full cursor-pointer border-border flex items-center gap-2">
          <FaGlobe className="w-4 h-4" />
          <div className="hidden sm:block">
            <SelectValue />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ar" className="flex gap-2">
            العربية
          </SelectItem>

          <SelectItem value="en" className="flex gap-2">
            English
          </SelectItem>
        </SelectContent>
      </Select>

      {openLoading && <LoadingModal />}
    </>
  );
};

export default LanguageSwitcher;

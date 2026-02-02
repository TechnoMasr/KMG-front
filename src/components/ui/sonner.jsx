import {
  HiCheckCircle,
  HiInformationCircle,
  HiXCircle,
} from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <HiCheckCircle className="w-4 h-4" />,
        info: <HiInformationCircle className="w-4 h-4" />,
        warning: <HiInformationCircle className="w-4 h-4" />,
        error: <HiXCircle className="w-4 h-4" />,
        loading: <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }}
      {...props}
    />
  );
};

export { Toaster };

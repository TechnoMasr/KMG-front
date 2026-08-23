import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const PhoneInputField = ({ control, name, label }) => {
  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel htmlFor={name} className="mb-1">{label}</FormLabel>}

            <div dir="ltr">
              <FormControl>
                <PhoneInput
                  {...field}
                  international
                  defaultCountry="EG"
                  countryCallingCodeEditable={false}
                  className={cn("phone-input-wrapper")}
                />
              </FormControl>
            </div>

            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhoneInputField;

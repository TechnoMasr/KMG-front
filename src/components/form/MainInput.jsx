import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const MainInput = ({
  control,
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  options = [],
  icon = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <FormField
        control={control}
        name={name}
        id={name}
        render={({ field }) => (
          <FormItem>
            {label && (
              <FormLabel htmlFor={name} className="mb-1">
                {label}
              </FormLabel>
            )}

            <FormControl>
              <div>
                {type === "textarea" && (
                  <Textarea
                    {...field}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="min-h-20 max-h-[150px] focus-visible:border-primary focus-visible:ring-primary/50"
                  />
                )}

                {type === "select" && (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={`focus-visible:border-primary focus-visible:ring-primary/50`}
                    >
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>

                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {type === "file" && (
                  <Input
                    id={name}
                    type="file"
                    disabled={disabled}
                    className="focus-visible:border-primary focus-visible:ring-primary/50"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                )}

                {type !== "textarea" &&
                  type !== "select" &&
                  type !== "file" && (
                    <div className="relative">
                      {icon && (
                        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          {icon}
                        </span>
                      )}

                      <Input
                        id={name}
                        {...field}
                        type={
                          isPassword
                            ? showPassword
                              ? "text"
                              : "password"
                            : type
                        }
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`bg-muted rounded-full focus-visible:border-primary focus-visible:ring-primary/50
                        [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]
                        [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]
                        ${icon ? "ps-10" : ""} ${isPassword ? "pe-10" : ""}`}
                      />

                      {isPassword && (
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                          disabled={disabled}
                        >
                          {showPassword ? (
                            <FiEyeOff size={18} />
                          ) : (
                            <FiEye size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </FormControl>

            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MainInput;

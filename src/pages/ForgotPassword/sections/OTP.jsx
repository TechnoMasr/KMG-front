import { useState, useEffect } from "react";
import AuthContainer from "@/components/form/AuthContainer";

import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Link } from "react-router";
import { z } from "zod";

import FormError from "@/components/form/FormError";
import { verifyOtp, resendOtp } from "@/api/forgotPasswordServices";
import { useTranslation } from "react-i18next";

const OTP = ({ goNext, parentData, setParentData }) => {
  const { t } = useTranslation();

  const otpSchema = z.object({
    otp: z.string().length(6, t("otp.otpRequired")),
  });

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // حالة العداد
  const [countdown, setCountdown] = useState(60);

  // useMutation للتحقق من OTP
  const {
    mutate: verifyOtpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ code, email }) => verifyOtp({ code, email }),
    onSuccess: (data) => {
      setParentData((prev) => ({
        ...prev,
        otp: form.getValues("otp"),
        reset_token: data.reset_token,
      }));
      goNext();
    },
  });

  // useMutation لإعادة الإرسال
  const { mutate: resendOtpMutation, isPending: isResending } = useMutation({
    mutationFn: (email) => resendOtp(email),
    onSuccess: () => {
      setCountdown(60); // يبدأ العداد 60 ثانية بعد إعادة الإرسال
    },
  });

  // العداد يتناقص كل ثانية
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = (data) => {
    verifyOtpMutation({ code: data.otp, email: parentData.email });
  };

  const handleResend = () => {
    resendOtpMutation(parentData.email);
  };

  return (
    <AuthContainer
      title={t("otp.title")}
      description={t("otp.description", { email: parentData.email })}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full flex flex-col items-center"
          dir="ltr"
        >
          {/* OTP INPUT */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <div className="space-y-2">
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="text-2xl w-12 h-12 border bg-white text-black data-[active=true]:border-primary data-[active=true]:ring-primary/50"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <p className="text-sm text-red-400 text-center">
                  {form.formState.errors.otp?.message}
                </p>
              </div>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("otp.verifying") : t("otp.confirm")}
          </Button>

          <p className="text-sm text-center">
            {t("otp.notReceived")}
            <button
              type="button"
              className={`text-purple-500 hover:underline ms-1 ${
                countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={countdown > 0 || isResending}
              onClick={handleResend}
            >
              {countdown > 0
                ? t("otp.resendIn", { countdown })
                : t("otp.resend")}
            </button>
          </p>

          <Link
            to="/login"
            className="text-sm hover:underline text-muted-foreground"
          >
            {t("otp.backToLogin")}
          </Link>

          {error && (
            <FormError
              errorMsg={error.response?.data?.message || t("otp.wrongOtp")}
            />
          )}
        </form>
      </Form>
    </AuthContainer>
  );
};

export default OTP;

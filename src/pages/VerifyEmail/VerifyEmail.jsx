import { useEffect, useState } from "react";
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

import { useNavigate } from "react-router";
import { z } from "zod";

import FormError from "@/components/form/FormError";
import {
  sendOtpVerifyEmail,
  verifyEmail,
} from "@/services/verifyEmailServices";
import { useDispatch, useSelector } from "react-redux";
import {
  addProfile,
  clearProfile,
  logoutAct,
} from "@/store/profile/profileSlice";

import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const { profile } = useSelector((state) => state.profile);

  const otpSchema = z.object({
    otp: z.string().length(6, t("verifyEmail.otpError")),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const [countdown, setCountdown] = useState(60);

  /* ================== Send OTP on Mount ================== */
  const [otpSent, setOtpSent] = useState(false);

  const { mutate: sendOtpMutation, isPending: isSending } = useMutation({
    mutationFn: (email) => sendOtpVerifyEmail(email),
    onSuccess: () => {
      setCountdown(60);
      setOtpSent(true);
    },
  });

  useEffect(() => {
    if (profile?.email && !otpSent) {
      sendOtpMutation(profile.email);
    }
  }, [profile?.email, otpSent]);

  /* ================== Verify Email ================== */
  const {
    mutate: verifyEmailMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ email, code }) => verifyEmail({ email, code }),
    onSuccess: (data) => {
      dispatch(addProfile(data?.user));
      navigate("/", { replace: true });
    },
  });

  /* ================== Countdown ================== */
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /* ================== Handlers ================== */
  const onSubmit = (data) => {
    verifyEmailMutation({ email: profile?.email, code: data.otp });
  };

  const handleResend = () => {
    sendOtpMutation(profile?.email);
  };

  const handleBackToRegister = () => {
    dispatch(logoutAct());
    dispatch(clearProfile());
    navigate(`/register`, { replace: true });
  };

  return (
    <AuthContainer
      title={t("verifyEmail.title")}
      description={t("verifyEmail.description", { email: profile?.email })}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full flex flex-col items-center"
          dir="ltr"
        >
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
            {isPending ? t("verifyEmail.submitting") : t("verifyEmail.submit")}
          </Button>

          <p className="text-sm text-center">
            {t("verifyEmail.notReceived")}
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isSending}
              className={`text-purple-500 hover:underline ms-1 ${
                countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {countdown > 0
                ? t("verifyEmail.resendIn", { seconds: countdown })
                : t("verifyEmail.resend")}
            </button>
          </p>

          <button
            type="button"
            onClick={handleBackToRegister}
            className="text-sm hover:underline text-muted-foreground cursor-pointer"
          >
            {t("verifyEmail.back")}
          </button>

          {error && (
            <FormError
              errorMsg={
                error.response?.data?.message || t("verifyEmail.invalidCode")
              }
            />
          )}
        </form>
      </Form>
    </AuthContainer>
  );
};

export default VerifyEmail;

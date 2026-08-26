import AuthContainer from "@/components/form/AuthContainer";
import MainInput from "@/components/form/MainInput";
import FormError from "@/components/form/FormError";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { FaLock } from "react-icons/fa";
import { useMemo } from "react";
import { getPasswordStrength, strengthLabel } from "@/utils/PasswordStrength";

import { z } from "zod";
import { useNavigate } from "react-router";
import { resetPassword } from "@/api/forgotPasswordServices";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = ({ parentData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const resetPasswordSchema = z
    .object({
      password: z.string().min(6, t("resetPassword.passwordShort")),
      password_confirmation: z
        .string()
        .min(6, t("resetPassword.confirmRequired")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("resetPassword.notMatched"),
      path: ["password_confirmation"],
    });

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const password = form.watch("password");
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  // useMutation لإرسال طلب إعادة التعيين
  const {
    mutate: resetPasswordMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload) => resetPassword(payload),
    onSuccess: () => {
      navigate("/login"); // بعد النجاح نرجع لتسجيل الدخول
    },
  });

  const onSubmit = (data) => {
    // نرسل جميع البيانات المطلوبة
    resetPasswordMutation({
      reset_token: parentData.reset_token,
      code: parentData.otp,
      email: parentData.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  const progressColor =
    strength <= 1
      ? "#ef4444"
      : strength === 2
        ? "#fbbf24"
        : strength === 3
          ? "#84cc16"
          : "#22c55e";

  return (
    <AuthContainer
      title={t("resetPassword.title")}
      description={t("resetPassword.description")}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          {error && (
            <FormError
              errorMsg={
                error.response?.data?.message || t("resetPassword.error")
              }
            />
          )}

          <MainInput
            control={form.control}
            name="password"
            label={t("resetPassword.newPassword")}
            type="password"
            icon={<FaLock size={18} />}
          />

          <MainInput
            control={form.control}
            name="password_confirmation"
            label={t("resetPassword.confirmPassword")}
            type="password"
            icon={<FaLock size={18} />}
          />

          {/* Password Strength */}
          <div className="space-y-1">
            <Progress
              value={(strength / 4) * 100}
              indicatorColor={progressColor}
              className="bg-accent"
            />

            {strength > 0 && (
              <p className="text-sm text-muted-foreground">
                {t("resetPassword.strength")}
                <span
                  className="font-semibold ms-1"
                  style={{ color: progressColor }}
                >
                  {strengthLabel(strength)}
                </span>
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("resetPassword.resetting") : t("resetPassword.save")}
          </Button>
        </form>
      </Form>
    </AuthContainer>
  );
};

export default ResetPasswordPage;

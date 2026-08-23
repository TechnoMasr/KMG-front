import AuthContainer from "@/components/form/AuthContainer";
import MainInput from "@/components/form/MainInput";
import PhoneInputField from "@/components/form/PhoneInputField"; // <-- استدعاء المكون
import FormError from "@/components/form/FormError";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { z } from "zod";
import { Link, useNavigate } from "react-router";

import { registerUser } from "@/services/authServices";
import { useDispatch } from "react-redux";
import { getProfileAct } from "@/store/profile/profileSlice";

import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "react-phone-number-input";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerSchema = z
    .object({
      name: z.string().min(3, t("register.errors.nameShort")),
      email: z.string().email(t("register.errors.emailInvalid")),
      whatsapp: z
        .string({ required_error: t("register.errors.whatsappInvalid") })
        .refine((val) => val && isValidPhoneNumber(val), {
          message: t("register.errors.whatsappInvalid"),
        }),
      password: z.string().min(6, t("register.errors.passwordShort")),
      password_confirmation: z
        .string()
        .min(6, t("register.errors.passwordConfirmationRequired")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("register.errors.passwordMismatch"),
      path: ["password_confirmation"],
    });

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      password: "",
      password_confirmation: "",
    },
  });

  const {
    mutate: register,
    isPending,
    error,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      dispatch(getProfileAct())
        .unwrap()
        .then(() => {
          navigate("/verify-email", { replace: true });
        });
    },
  });

  const onSubmit = (data) => {
    register({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp, // <-- إرساله للـ Backend باسم whatsapp
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  return (
    <AuthContainer
      title={t("register.title")}
      description={t("register.description")}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <MainInput
            control={form.control}
            name="name"
            label={t("register.name")}
            placeholder={t("register.namePlaceholder")}
            icon={<FaUser size={18} />}
          />

          <MainInput
            control={form.control}
            name="email"
            label={t("register.email")}
            placeholder={t("register.emailPlaceholder")}
            icon={<FaEnvelope size={18} />}
          />

          {/* حقل الواتساب الجديد */}
          <PhoneInputField
            control={form.control}
            name="whatsapp"
            label={t("register.whatsapp")}
          />

          <MainInput
            control={form.control}
            name="password"
            label={t("register.password")}
            type="password"
            icon={<FaLock size={18} />}
          />

          <MainInput
            control={form.control}
            name="password_confirmation"
            label={t("register.passwordConfirmation")}
            type="password"
            icon={<FaLock size={18} />}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("register.submitting") : t("register.submit")}
          </Button>

          <p className="text-sm text-center">
            {t("register.haveAccount")}
            <Link
              to="/login"
              className="text-purple-500 cursor-pointer hover:underline"
            >
              {" "}
              {t("register.login")}
            </Link>
          </p>

          {error && (
            <FormError
              errorMsg={
                error.response?.data?.message || t("register.errors.generic")
              }
            />
          )}
        </form>
      </Form>
    </AuthContainer>
  );
};

export default Register;

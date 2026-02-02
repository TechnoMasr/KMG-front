import AuthContainer from "@/components/form/AuthContainer";
import MainInput from "@/components/form/MainInput";
import FormError from "@/components/form/FormError";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router";
import { z } from "zod";
import { sendOtp } from "@/services/forgotPasswordServices";
import { useTranslation } from "react-i18next";

const CheckEmail = ({ goNext, setParentData }) => {
  const { t } = useTranslation();

  const forgotPasswordSchema = z.object({
    email: z.string().email(t("checkEmail.invalidEmail")),
  });

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // useMutation
  const {
    mutate: sendOtpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ email }) => sendOtp(email),
    onSuccess: (data, variables) => {
      setParentData({ email: variables.email });
      goNext();
    },
  });

  const onSubmit = (data) => {
    sendOtpMutation(data);
  };

  return (
    <AuthContainer
      title={t("checkEmail.title")}
      description={t("checkEmail.description")}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <MainInput
            control={form.control}
            name="email"
            label={t("checkEmail.emailLabel")}
            placeholder={t("checkEmail.emailPlaceholder")}
            icon={<FaEnvelope size={18} />}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending
              ? t("checkEmail.sending")
              : t("checkEmail.sendResetLink")}
          </Button>

          <p className="text-sm text-center">
            {t("checkEmail.rememberPassword")}
            <Link
              to="/login"
              className="text-purple-500 cursor-pointer hover:underline"
            >
              {" "}
              {t("checkEmail.login")}
            </Link>
          </p>

          {error && (
            <FormError
              errorMsg={
                error.response?.data?.message || t("checkEmail.genericError")
              }
            />
          )}
        </form>
      </Form>
    </AuthContainer>
  );
};

export default CheckEmail;

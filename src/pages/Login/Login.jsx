import AuthContainer from "@/components/form/AuthContainer";
import MainInput from "@/components/form/MainInput";
import FormError from "@/components/form/FormError";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { loginUser } from "@/services/authServices";
import { useDispatch } from "react-redux";
import { addProfile } from "@/store/profile/profileSlice";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const loginSchema = z.object({
    email: z.string().email(t("auth.login.invalidEmail")),
    password: z.string().min(6, t("auth.login.shortPassword")),
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      navigate("/");
      dispatch(addProfile({ ...data?.user, image: data?.user?.image_url }));
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <AuthContainer
      title={t("auth.login.title")}
      description={t("auth.login.description")}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <MainInput
            control={form.control}
            name="email"
            label={t("auth.login.emailLabel")}
            placeholder={t("auth.login.emailPlaceholder")}
            icon={<HiOutlineMail size={18} />}
          />

          <MainInput
            control={form.control}
            name="password"
            label={t("auth.login.passwordLabel")}
            type="password"
            icon={<HiOutlineLockClosed size={18} />}
          />

          <Link
            to="/forgot-password"
            className="text-sm hover:underline block w-fit ms-auto"
          >
            {t("auth.login.forgotPassword")}
          </Link>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("auth.login.loading") : t("auth.login.submit")}
          </Button>

          <p className="text-sm text-center">
            {t("auth.login.subText")}{" "}
            <Link
              to="/register"
              className="text-purple-500 cursor-pointer hover:underline"
            >
              {t("auth.login.register")}
            </Link>
          </p>

          {error && (
            <FormError
              errorMsg={error.response?.data?.message || t("auth.login.error")}
            />
          )}
        </form>
      </Form>
    </AuthContainer>
  );
};

export default Login;

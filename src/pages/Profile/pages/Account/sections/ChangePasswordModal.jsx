import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Form } from "@/components/ui/form";
import MainInput from "@/components/form/MainInput";
import FormError from "@/components/form/FormError";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FaLock } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/api/authServices";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ChangePasswordModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState("");

  /* ---------------- schema ---------------- */
  const changePasswordSchema = z
    .object({
      current_password: z
        .string()
        .min(6, t("changePassword.form.currentPassword.validation.min")),
      password: z
        .string()
        .min(6, t("changePassword.form.newPassword.validation.min")),
      password_confirmation: z
        .string()
        .min(6, t("changePassword.form.confirmPassword.validation.min")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("changePassword.form.confirmPassword.validation.match"),
      path: ["password_confirmation"],
    });

  /* ---------------- form ---------------- */
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  /* ---------------- mutation ---------------- */
  const changePasswordMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success(t("changePassword.messages.success"));
      form.reset();
      onClose();
      setErrorMsg("");
    },
    onError: (error) => {
      setErrorMsg(error?.response?.data?.message);
    },
  });

  /* ---------------- submit ---------------- */
  const onSubmit = (data) => {
    changePasswordMutation.mutate({
      current_password: data.current_password,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          pointerEvents: changePasswordMutation.isPending ? "none" : "auto",
        }}
      >
        <DialogHeader className="text-center">
          <DialogDescription />
          <DialogTitle className="text-xl text-center">
            {t("changePassword.title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <MainInput
              control={form.control}
              name="current_password"
              label={t("changePassword.form.currentPassword.label")}
              type="password"
              icon={<FaLock size={18} />}
            />

            <MainInput
              control={form.control}
              name="password"
              label={t("changePassword.form.newPassword.label")}
              type="password"
              icon={<FaLock size={18} />}
            />

            <MainInput
              control={form.control}
              name="password_confirmation"
              label={t("changePassword.form.confirmPassword.label")}
              type="password"
              icon={<FaLock size={18} />}
            />

            <DialogFooter className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? t("changePassword.buttons.submitting")
                  : t("changePassword.buttons.submit")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
              >
                {t("changePassword.buttons.cancel")}
              </Button>
            </DialogFooter>

            {errorMsg && <FormError errorMsg={errorMsg} />}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;

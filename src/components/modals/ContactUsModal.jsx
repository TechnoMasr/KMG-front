import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MainInput from "@/components/form/MainInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInputField from "@/components/form/PhoneInputField";

import { useMutation } from "@tanstack/react-query";
import { getContactUs } from "@/api/mainServices";
import { useState } from "react";
import FormError from "@/components/form/FormError";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";
import { toast } from "sonner";

const ContactUsModal = () => {
  const dispatch = useDispatch();
  const { contactUsModal } = useSelector((state) => state.modals);

  const onClose = () => {
    dispatch(closeModal("contactUsModal"));
  };

  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useTranslation();

  const FormSchema = z.object({
    name: z.string().min(2, t("ContactUsModal.validation.nameMin")),
    email: z.string().email(t("ContactUsModal.validation.emailInvalid")),
    phone: z
      .string()
      .min(1, t("ContactUsModal.validation.phoneRequired"))
      .refine(
        (val) => isValidPhoneNumber(val),
        t("ContactUsModal.validation.phoneInvalid"),
      ),
    message: z.string().min(5, t("ContactUsModal.validation.messageMin")),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: getContactUs,
    onSuccess: () => {
      form.reset();
      toast.success(t("ContactUsModal.success"));
      setErrorMsg("");
      onClose();
    },
    onError: (error) => {
      setErrorMsg(error?.response?.data?.message || t("ContactUsModal.error"));
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <Dialog open={contactUsModal} onOpenChange={onClose}>
      <DialogContent
        className={`max-h-[90vh] overflow-y-auto custom_scrollbar`}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {t("ContactUsModal.title")}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <MainInput
              control={form.control}
              name="name"
              label={t("ContactUsModal.fields.name.label")}
              placeholder={t("ContactUsModal.fields.name.placeholder")}
            />

            <MainInput
              control={form.control}
              name="email"
              label={t("ContactUsModal.fields.email.label")}
              placeholder={t("ContactUsModal.fields.email.placeholder")}
            />

            <PhoneInputField
              control={form.control}
              name="phone"
              label={t("ContactUsModal.fields.phone.label")}
            />

            <MainInput
              type="textarea"
              control={form.control}
              name="message"
              label={t("ContactUsModal.fields.message.label")}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? t("ContactUsModal.sending")
                : t("ContactUsModal.submit")}
            </Button>

            {errorMsg && <FormError errorMsg={errorMsg} />}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUsModal;

import MainInput from "@/components/form/MainInput";
import ImageInput from "@/components/form/ImageInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/services/paymentsServices";
import { useState } from "react";
import FormError from "@/components/form/FormError";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const InstaPayForm = ({ cancelPayment, currentPayment, state }) => {
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState("");

  // schema
  const InstaPaySchema = z.object({
    sender_number: z.string().min(1, t("InstaPayForm.senderNumberRequired")),
    transfer_image: z
      .any()
      .refine((file) => file instanceof File, t("InstaPayForm.imageRequired")),
    payment_note: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(InstaPaySchema),
    defaultValues: {
      sender_number: "",
      transfer_image: null,
      payment_note: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success(t("InstaPayForm.paymentConfirmed"));
      setErrorMsg("");
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      setErrorMsg(
        error?.response?.data?.message || t("InstaPayForm.genericError"),
      );
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    // form data
    formData.append("sender_number", data.sender_number);
    formData.append("transfer_image", data.transfer_image);
    formData.append("payment_note", data.payment_note);

    // payment data
    formData.append("payment_method", currentPayment.paymentMethod);

    // state data
    formData.append("product_id", state.product_id);
    formData.append("login_data", state.login_data);
    formData.append("password", state.password);

    // formData.append("gift_code", state.gift_code);
    // إرسال الأكواد الاحتياطية كـ Array
    if (Array.isArray(state?.backup_codes) && state.backup_codes.length > 0) {
      state.backup_codes.forEach((code) => {
        formData.append("backup_codes[]", code); // أو "backup_codes" بدون أقواس حسب تجهيز الـ Backend
      });
    }

    mutate(formData);
  };;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        {currentPayment.transfer_number && (
          <div className="flex flex-col gap-2">
            <p className="font-bold">{t("InstaPayForm.transferNumber")}</p>
            <span className="bg-muted p-2 rounded-lg">
              {currentPayment.transfer_number}
            </span>
          </div>
        )}

        {currentPayment.username && (
          <div className="flex flex-col gap-2">
            <p className="font-bold">{t("InstaPayForm.username")}</p>
            <span className="bg-muted p-2 rounded-lg">
              {currentPayment.username}
            </span>
          </div>
        )}

        <MainInput
          control={form.control}
          name="sender_number"
          label={t("InstaPayForm.senderNumberLabel")}
          placeholder={t("InstaPayForm.senderNumberPlaceholder")}
        />

        <ImageInput control={form.control} name="transfer_image" />

        <MainInput
          control={form.control}
          type="textarea"
          name="payment_note"
          label={t("InstaPayForm.noteLabel")}
          placeholder={t("InstaPayForm.notePlaceholder")}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full flex-1"
            onClick={cancelPayment}
          >
            {t("InstaPayForm.cancel")}
          </Button>

          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending
              ? t("InstaPayForm.confirming")
              : t("InstaPayForm.confirmPayment")}
          </Button>
        </div>

        {errorMsg && <FormError errorMsg={errorMsg} />}
      </form>
    </Form>
  );
};

export default InstaPayForm;

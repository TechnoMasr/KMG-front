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

const PaypalForm = ({ cancelPayment, currentPayment, state }) => {
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState("");

  // schema
  const paypalFormSchema = z.object({
    paypal_name: z.string().min(1, t("PaypalForm.usernameRequired")),
    transfer_image: z
      .any()
      .refine((file) => file instanceof File, t("PaypalForm.imageRequired")),
    payment_note: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(paypalFormSchema),
    defaultValues: {
      paypal_name: "",
      transfer_image: null,
      payment_note: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success(t("PaypalForm.paymentConfirmed"));
      setErrorMsg("");
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      setErrorMsg(
        error?.response?.data?.message || t("PaypalForm.genericError"),
      );
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    // form data
    formData.append("paypal_name", data.paypal_name);
    formData.append("transfer_image", data.transfer_image);
    formData.append("payment_note", data.payment_note);

    // payment data
    formData.append("payment_method", currentPayment.paymentMethod);

    // state data
    formData.append("product_id", state.product_id);
    formData.append("login_data", state.login_data);
    formData.append("gift_code", state.gift_code);
    formData.append("password", state.password);

    mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        {currentPayment.transfer_number && (
          <div className="flex flex-col gap-2">
            <p className="font-bold">{t("PaypalForm.transferNumber")}</p>
            <span className="bg-muted p-2 rounded-lg">
              {currentPayment.transfer_number}
            </span>
          </div>
        )}

        {currentPayment.link && (
          <div className="flex flex-col gap-2">
            <p className="font-bold">{t("PaypalForm.paypalLink")}</p>
            <a
              href={currentPayment.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-muted p-2 rounded-lg hover:underline cursor-pointer"
            >
              {currentPayment.link}
            </a>
          </div>
        )}

        <MainInput
          control={form.control}
          name="paypal_name"
          label={t("PaypalForm.usernameLabel")}
          placeholder={t("PaypalForm.usernamePlaceholder")}
        />

        <ImageInput control={form.control} name="transfer_image" />

        <MainInput
          control={form.control}
          type="textarea"
          name="payment_note"
          label={t("PaypalForm.noteLabel")}
          placeholder={t("PaypalForm.notePlaceholder")}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full flex-1"
            onClick={cancelPayment}
          >
            {t("PaypalForm.cancel")}
          </Button>

          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending
              ? t("PaypalForm.confirming")
              : t("PaypalForm.confirmPayment")}
          </Button>
        </div>

        {errorMsg && <FormError errorMsg={errorMsg} />}
      </form>
    </Form>
  );
};

export default PaypalForm;

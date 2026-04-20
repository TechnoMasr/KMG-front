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
import MainInput from "@/components/form/MainInput";

const BinancePayForm = ({ cancelPayment, currentPayment, state }) => {
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState("");

  // schema
  const binancePaySchema = z.object({
    transfer_image: z
      .any()
      .refine(
        (file) => file instanceof File,
        t("BinancePayForm.imageRequired"),
      ),
    payment_note: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(binancePaySchema),
    defaultValues: {
      transfer_image: null,
      payment_note: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success(t("BinancePayForm.paymentConfirmed"));
      setErrorMsg("");
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      setErrorMsg(
        error?.response?.data?.message || t("BinancePayForm.genericError"),
      );
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    // form data
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
            <p className="font-bold">{t("BinancePayForm.transferNumber")}</p>
            <span className="bg-muted p-2 rounded-lg">
              {currentPayment.transfer_number}
            </span>
          </div>
        )}

        {currentPayment.binance_id && (
          <div className="flex flex-col gap-2">
            <p className="font-bold">{t("BinancePayForm.binanceId")}</p>
            <a
              href={currentPayment.binance_id}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-muted p-2 rounded-lg hover:underline cursor-pointer"
            >
              {currentPayment.binance_id}
            </a>
          </div>
        )}

        <ImageInput control={form.control} name="transfer_image" />

        <MainInput
          control={form.control}
          type="textarea"
          name="payment_note"
          label={t("BinancePayForm.noteLabel")}
          placeholder={t("BinancePayForm.notePlaceholder")}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full flex-1"
            onClick={cancelPayment}
          >
            {t("BinancePayForm.cancel")}
          </Button>

          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending
              ? t("BinancePayForm.confirming")
              : t("BinancePayForm.confirmPayment")}
          </Button>
        </div>

        {errorMsg && <FormError errorMsg={errorMsg} />}
      </form>
    </Form>
  );
};

export default BinancePayForm;

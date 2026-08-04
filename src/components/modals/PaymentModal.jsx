import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Form } from "@/components/ui/form";
import MainInput from "@/components/form/MainInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const PaymentModal = ({
  open,
  onClose,
  product_id,
  product_price,
  currency,
  gift_code = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const Schema = z.object({
    login_data: z.string().min(6, t("PaymentModal.validation.loginDataShort")),
    password: z.string().min(6, t("PaymentModal.validation.passwordShort")),
    gift_code: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      login_data: "",
      password: "",
      gift_code: "",
    },
  });

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (data) => {
    navigate("/payment", {
      state: {
        product_id,
        product_price,
        currency,
        login_data: data.login_data,
        password: data.password,
        ...(gift_code && { gift_code: data.gift_code }),
      },
    });

    handleCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl text-center">
            {t("PaymentModal.title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <MainInput
              control={form.control}
              name="login_data"
              label={t("PaymentModal.loginData")}
            />

            <MainInput
              control={form.control}
              name="password"
              type="password"
              label={t("PaymentModal.password")}
            />

            {gift_code && (
              <MainInput
                type="textarea"
                control={form.control}
                name="gift_code"
                label={t("PaymentModal.giftCode")}
              />
            )}

            <DialogFooter>
              <Button type="submit" className="flex-1">
                {t("PaymentModal.save")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={handleCancel}
              >
                {t("PaymentModal.cancel")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

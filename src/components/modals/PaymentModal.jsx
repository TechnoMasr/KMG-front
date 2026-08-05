import { useState } from "react";
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
import { FiPlus, FiX } from "react-icons/fi"; // استخدام react-icons

const PaymentModal = ({
  open,
  onClose,
  product_id,
  product_price,
  currency,
  backup_codes = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currentCode, setCurrentCode] = useState("");

  const Schema = z.object({
    login_data: z.string().min(6, t("PaymentModal.validation.loginDataShort")),
    password: z.string().min(6, t("PaymentModal.validation.passwordShort")),
    backup_codes: z.array(z.string()).default([]),
  });

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      login_data: "",
      password: "",
      backup_codes: [],
    },
  });

  const handleCancel = () => {
    form.reset();
    setCurrentCode("");
    onClose();
  };

  const handleAddCode = (e) => {
    e?.preventDefault();

    const trimmed = currentCode.trim();
    if (!trimmed) return;

    const existingCodes = form.getValues("backup_codes") || [];

    form.setValue("backup_codes", [...existingCodes, trimmed], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setCurrentCode("");
  };

  const handleRemoveCode = (indexToRemove) => {
    const existingCodes = form.getValues("backup_codes") || [];
    const updatedCodes = existingCodes.filter(
      (_, index) => index !== indexToRemove,
    );

    form.setValue("backup_codes", updatedCodes, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (data) => {
    let finalBackupCodes = [...data.backup_codes];
    if (currentCode.trim()) {
      finalBackupCodes.push(currentCode.trim());
    }

    navigate("/payment", {
      state: {
        product_id,
        product_price,
        currency,
        login_data: data.login_data,
        password: data.password,
        ...(backup_codes && { backup_codes: finalBackupCodes }),
      },
    });

    handleCancel();
  };

  const watchBackupCodes = form.watch("backup_codes");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
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

            {backup_codes && (
              <div className="space-y-2">
                <label className="text-sm font-medium inline-block">
                  {t("PaymentModal.backupCodes")}
                </label>

                <div className="space-y-1">
                  <textarea
                    value={currentCode}
                    onChange={(e) => setCurrentCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCode();
                      }
                    }}
                    placeholder={t("PaymentModal.backupCodePlaceholder")}
                    className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
                    min-h-16 max-h-20 overflow-y-auto w-full bg-muted"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCode}
                    variant="secondary"
                    className="flex items-center gap-1 ms-auto"
                  >
                    <FiPlus className="w-4 h-4" />
                    {t("PaymentModal.addCode")}
                  </Button>
                </div>

                {watchBackupCodes?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 max-h-32 overflow-y-auto custom_scrollbar">
                    {watchBackupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-muted rounded-full border"
                      >
                        <span className="font-semibold text-muted-foreground">
                          {t("PaymentModal.codeNumber")} {index + 1}:
                        </span>
                        <span className="wrap-break-word break-all flex-1">
                          {code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCode(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <FiX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

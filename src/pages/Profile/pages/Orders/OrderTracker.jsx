import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getSingleOrder } from "@/api/paymentsServices";
import { motion } from "framer-motion";
import {
  FaClock,
  FaGear,
  FaCircleCheck,
  FaCircleXmark,
  FaCopy,
  FaCheck,
  FaBoxOpen,
  FaCreditCard,
  FaShieldHalved,
} from "react-icons/fa6";
import DetailsModalSkeleton from "@/components/Loading/SkeletonLoading/DetailsModalSkeleton";

// خطوات التتبع
const TRACKING_STEPS = [
  { key: "pending", icon: FaClock },
  { key: "processing", icon: FaGear },
  { key: "completed", icon: FaCircleCheck },
];

const OrderTracker = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [copiedId, setCopiedId] = useState(null);

  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ["order-details", id],
    queryFn: () => getSingleOrder(id),
  });

  const handleCopy = (text, itemKey) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(itemKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="container sectionPadding max-w-5xl">
        <DetailsModalSkeleton />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container sectionPadding text-center text-muted-foreground">
        {t("orderTracker.notFound")}
      </div>
    );
  }

  // تحديد خطوة التقدم الحالية
  const isCancelled = orderDetails?.status_key === "cancelled";
  const currentStepIndex = TRACKING_STEPS.findIndex(
    (step) => step.key === orderDetails?.status_key,
  );
  const activeIndex = currentStepIndex !== -1 ? currentStepIndex : 0;

  // إعداد مصفوفة التفاصيل بحسب نوع الخدمة
  const serviceDetails = [
    {
      service: "accounts",
      items: [
        {
          key: "acc_name",
          title: t("detailsModal.services.accounts.accountName"),
          content: orderDetails?.product?.title,
        },
        {
          key: "acc_plat",
          title: t("detailsModal.services.accounts.platform"),
          content: orderDetails?.product?.platforms
            ?.map((i) => i.name)
            .join(", "),
        },
        {
          key: "acc_country",
          title: t("detailsModal.services.accounts.country"),
          content: orderDetails?.product?.country_name,
        },
        {
          key: "acc_email",
          title: t("detailsModal.services.accounts.accountEmail"),
          content: orderDetails?.account_email,
          copyable: true,
        },
        {
          key: "acc_pass",
          title: t("detailsModal.services.accounts.accountPassword"),
          content: orderDetails?.account_password,
          copyable: true,
        },
        {
          key: "email",
          title: t("detailsModal.services.accounts.email"),
          content: orderDetails?.email,
          copyable: true,
        },
        {
          key: "pass",
          title: t("detailsModal.services.accounts.password"),
          content: orderDetails?.password,
          copyable: true,
        },
        {
          key: "note",
          title: t("detailsModal.services.accounts.note"),
          content: orderDetails?.note,
        },
      ],
    },
    {
      service: "subscriptions",
      items: [
        {
          key: "sub_name",
          title: t("detailsModal.services.subscriptions.subscriptionName"),
          content: orderDetails?.product?.title,
        },
        {
          key: "sub_login",
          title: t("detailsModal.services.subscriptions.loginData"),
          content: orderDetails?.login_data,
          copyable: true,
        },
        {
          key: "sub_pass",
          title: t("detailsModal.services.subscriptions.password"),
          content: orderDetails?.password,
          copyable: true,
        },
        {
          key: "sub_note",
          title: t("detailsModal.services.subscriptions.note"),
          content: orderDetails?.note,
        },
      ],
    },
    {
      service: "top_up",
      items: [
        {
          key: "top_price",
          title: t("detailsModal.services.top_up.coinsCount"),
          content: orderDetails?.product?.price,
        },
        {
          key: "top_login",
          title: t("detailsModal.services.top_up.loginData"),
          content: orderDetails?.login_data,
          copyable: true,
        },
        {
          key: "top_pass",
          title: t("detailsModal.services.top_up.password"),
          content: orderDetails?.password,
          copyable: true,
        },
        {
          key: "top_note",
          title: t("detailsModal.services.top_up.note"),
          content: orderDetails?.note,
        },
      ],
    },
    {
      service: "gift_cards",
      items: [
        {
          key: "gc_val",
          title: t("detailsModal.services.gift_cards.cardValue"),
          content: orderDetails?.product?.price,
        },
        {
          key: "gc_code",
          title: t("detailsModal.services.gift_cards.code"),
          content: orderDetails?.gift_code,
          copyable: true,
        },
        {
          key: "gc_note",
          title: t("detailsModal.services.gift_cards.note"),
          content: orderDetails?.note,
        },
      ],
    },
    {
      service: "add_game_to_account",
      items: [
        {
          key: "gm_name",
          title: t("detailsModal.services.add_game_to_account.gameName"),
          content: orderDetails?.product?.title,
        },
        {
          key: "gm_login",
          title: t("detailsModal.services.add_game_to_account.loginData"),
          content: orderDetails?.login_data,
          copyable: true,
        },
        {
          key: "gm_pass",
          title: t("detailsModal.services.add_game_to_account.password"),
          content: orderDetails?.password,
          copyable: true,
        },
        {
          key: "gm_note",
          title: t("detailsModal.services.add_game_to_account.note"),
          content: orderDetails?.note,
        },
      ],
    },
  ];

  const currentService = serviceDetails.find(
    (item) => item.service === orderDetails?.service,
  );
  const filteredItems =
    currentService?.items?.filter((item) => item.content) || [];

  return (
    <section className="space-y-8">
      {/* 1. Header & Order Info */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-wrap items-center justify-between gap-4 bg-card border-border p-6 rounded-2xl"
      >
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
            {t("orderTracker.orderCode")}
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            #{orderDetails?.order_code}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs text-muted-foreground block">
              {t("orderTracker.createdAt")}
            </span>
            <span className="text-sm font-medium">
              {orderDetails?.created_at}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Order Tracking Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 md:p-8 rounded-2xl bg-card border-border"
      >
        <h2 className="text-lg font-semibold mb-8 text-foreground flex items-center gap-2">
          <FaBoxOpen className="w-5 h-5 text-primary" />
          {t("orderTracker.statusTitle")}
        </h2>

        {isCancelled ? (
          <div className="flex items-center justify-center p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive gap-3">
            <FaCircleXmark className="w-6 h-6" />
            <span className="font-semibold text-lg">
              {t("orderTracker.cancelled")}
            </span>
          </div>
        ) : (
          <div className="relative flex items-center justify-between max-w-3xl mx-auto my-4">
            {/* Background Line */}
            <div className="absolute top-[24px] left-0 right-0 h-1 bg-muted z-0" />

            {/* Active Progress Line */}
            <motion.div
              className="absolute top-[28px] right-0 h-1 bg-primary z-0"
              initial={{ width: "0%" }}
              animate={{
                width: `${(activeIndex / (TRACKING_STEPS.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            {/* Steps */}
            {TRACKING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= activeIndex;
              const isCurrent = index === activeIndex;

              return (
                <div
                  key={step.key}
                  className="relative z-10 flex flex-col items-center"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                      backgroundColor: isCompleted
                        ? "var(--primary)"
                        : "#2f3433",
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white border-4 border-background transition-all duration-300 ${
                      isCurrent ? "ring-4 ring-primary/30" : ""
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span
                    className={`mt-3 text-xs md:text-sm font-medium transition-colors ${
                      isCompleted
                        ? "text-foreground font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(`orderTracker.statuses.${step.key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Delivery Estimate Footer */}
        {orderDetails?.estimated_delivery && (
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs md:text-sm text-muted-foreground">
            <span>{t("orderTracker.estimatedTime")}</span>
            <span className="font-semibold text-foreground">
              {orderDetails.estimated_delivery.from_time} -{" "}
              {orderDetails.estimated_delivery.to_time}{" "}
              {orderDetails.estimated_delivery.time_unit}
            </span>
          </div>
        )}
      </motion.div>

      {/* 3. Main Content: Details & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left/Main Column: Product & Service Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="card p-6 bg-card border-border rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <FaShieldHalved className="w-5 h-5 text-primary" />
              {t("orderTracker.detailsTitle")}
            </h3>

            {filteredItems.length ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.key}
                    className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col justify-between gap-2"
                  >
                    <span className="text-xs text-muted-foreground font-medium">
                      {item.title}
                    </span>

                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="text-sm font-semibold text-foreground break-all"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />

                      {item.copyable && (
                        <button
                          onClick={() => handleCopy(item.content, item.key)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                          {copiedId === item.key ? (
                            <FaCheck className="w-4 h-4 text-green-400" />
                          ) : (
                            <FaCopy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                {t("detailsModal.noDetails")}
              </p>
            )}
          </div>
        </motion.div>

        {/* Right Column: Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="card p-6 bg-card border-border rounded-2xl space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <FaCreditCard className="w-5 h-5 text-primary" />
              {t("orderTracker.summary")}
            </h3>

            {/* Product Image & Title */}
            {orderDetails?.product && (
              <div className="flex items-center gap-3 py-2">
                <img
                  src={
                    orderDetails.product.image ||
                    orderDetails.product.game_image
                  }
                  alt={orderDetails.product.title}
                  className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-sm truncate text-foreground">
                    {orderDetails.product.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {orderDetails?.service_label
                      ? t(orderDetails.service_label)
                      : orderDetails?.service}
                  </span>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-sm pt-2 border-t border-border/60">
              <div className="flex justify-between text-muted-foreground">
                <span>{t("orderTracker.itemPrice")}</span>
                <span>
                  {orderDetails?.order_price} {orderDetails?.currency}
                </span>
              </div>

              {orderDetails?.service_fee && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("orderTracker.serviceFee")}</span>
                  <span>
                    {orderDetails?.service_fee} {orderDetails?.currency}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t border-border">
                <span>{t("orderTracker.total")}</span>
                <span>
                  {orderDetails?.total_price} {orderDetails?.currency}
                </span>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {t("orderTracker.paymentMethod")}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-muted font-medium uppercase text-foreground">
                {orderDetails?.payment_method?.replace("_", " ")}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrderTracker;

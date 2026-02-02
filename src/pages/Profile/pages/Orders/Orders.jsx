import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

import { getOrders } from "@/services/paymentsServices";
import { useQuery } from "@tanstack/react-query";
import MyOrdersCard from "@/pages/Profile/pages/Orders/sections/MyOrdersCard";
import { useState } from "react";
import MyOrdersCardSkeleton from "@/components/Loading/SkeletonLoading/MyOrdersCardSkeleton";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import MainPagination from "@/components/common/MainPagination";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const { t } = useTranslation();

  const [status, setStatus] = useState("all");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my_orders", status, currentPage],
    queryFn: getOrders,
  });

  const applyPage = (page) => {
    setSearchParams({ page });
  };

  const list = [
    {
      id: 1,
      label: t("orders.stats.total"),
      value: orders?.extra?.total_count,
    },
    {
      id: 2,
      label: t("orders.stats.pending"),
      value: orders?.extra?.status_counts?.pending,
    },
    {
      id: 3,
      label: t("orders.stats.processing"),
      value: orders?.extra?.status_counts?.processing,
    },
    {
      id: 4,
      label: t("orders.stats.completed"),
      value: orders?.extra?.status_counts?.completed,
    },
    {
      id: 5,
      label: t("orders.stats.cancelled"),
      value: orders?.extra?.status_counts?.cancelled,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t("orders.title")}</h2>
        <p className="text-muted-foreground text-sm">{t("orders.subtitle")}</p>
      </div>

      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-2 sm:w-fit">
          <div className="flex items-center gap-2 min-w-fit text-sm">
            <HiAdjustmentsHorizontal size={20} />
            {t("orders.filter.label")}
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="rounded-full bg-input w-full">
              <SelectValue placeholder={t("orders.filter.placeholder")} />
            </SelectTrigger>

            <SelectContent className="bg-input rounded-xl">
              <SelectItem value="all">{t("orders.filter.all")}</SelectItem>
              <SelectItem value="pending">
                {t("orders.filter.pending")}
              </SelectItem>
              <SelectItem value="processing">
                {t("orders.filter.processing")}
              </SelectItem>
              <SelectItem value="completed">
                {t("orders.filter.completed")}
              </SelectItem>
              <SelectItem value="cancelled">
                {t("orders.filter.cancelled")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ul className="flex flex-wrap items-center gap-4 text-sm">
          {list.map((item) => (
            <li key={item.id} className="flex items-center gap-1">
              <p className="text-muted-foreground">{item.label}</p>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <MyOrdersCardSkeleton key={idx} />
          ))
        ) : orders?.items?.length === 0 ? (
          <EmptyDataSection msg={t("orders.empty")} />
        ) : (
          orders?.items?.map((order) => (
            <MyOrdersCard key={order.id} order={order} />
          ))
        )}
      </div>

      <MainPagination
        totalPages={orders?.meta?.last_page || 1}
        currentPage={currentPage}
        onPageChange={applyPage}
      />
    </div>
  );
};

export default Orders;

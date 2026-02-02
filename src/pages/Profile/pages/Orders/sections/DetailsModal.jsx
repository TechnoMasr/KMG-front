import DetailsModalSkeleton from "@/components/Loading/SkeletonLoading/DetailsModalSkeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSingleOrder } from "@/services/paymentsServices";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const DetailsModal = ({ order_id, open, onClose }) => {
  const { t } = useTranslation();
  const { lang } = useSelector((state) => state.language);

  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ["order-details" + order_id],
    queryFn: () => getSingleOrder(order_id),
    enabled: open,
  });

  const list = [
    {
      id: 1,
      service: "accounts",
      items: [
        {
          id: 1,
          title: t("detailsModal.services.accounts.accountName"),
          content: orderDetails?.product?.title,
        },
        {
          id: 2,
          title: t("detailsModal.services.accounts.platform"),
          content: orderDetails?.product?.platforms
            .map((item) => item.name)
            .join(", "),
        },
        {
          id: 3,
          title: t("detailsModal.services.accounts.country"),
          content: orderDetails?.product?.country_name,
        },
        {
          id: 4,
          title: t("detailsModal.services.accounts.accountEmail"),
          content: orderDetails?.account_email,
        },
        {
          id: 5,
          title: t("detailsModal.services.accounts.accountPassword"),
          content: orderDetails?.account_password,
        },
        {
          id: 6,
          title: t("detailsModal.services.accounts.email"),
          content: orderDetails?.email,
        },
        {
          id: 7,
          title: t("detailsModal.services.accounts.password"),
          content: orderDetails?.password,
        },
        {
          id: 8,
          title: t("detailsModal.services.accounts.note"),
          content: orderDetails?.note,
        },
      ],
    },

    {
      id: 2,
      service: "subscriptions",
      items: [
        {
          id: 1,
          title: t("detailsModal.services.subscriptions.subscriptionName"),
          content: orderDetails?.product?.title,
        },
        {
          id: 2,
          title: t("detailsModal.services.subscriptions.loginData"),
          content: orderDetails?.login_data,
        },
        {
          id: 3,
          title: t("detailsModal.services.subscriptions.password"),
          content: orderDetails?.password,
        },
        {
          id: 4,
          title: t("detailsModal.services.subscriptions.note"),
          content: orderDetails?.note,
        },
      ],
    },

    {
      id: 3,
      service: "top_up",
      items: [
        {
          id: 1,
          title: t("detailsModal.services.top_up.coinsCount"),
          content: orderDetails?.product?.price,
        },
        {
          id: 2,
          title: t("detailsModal.services.top_up.loginData"),
          content: orderDetails?.login_data,
        },
        {
          id: 3,
          title: t("detailsModal.services.top_up.password"),
          content: orderDetails?.password,
        },
        {
          id: 4,
          title: t("detailsModal.services.top_up.note"),
          content: orderDetails?.note,
        },
      ],
    },

    {
      id: 4,
      service: "gift_cards",
      items: [
        {
          id: 1,
          title: t("detailsModal.services.gift_cards.cardValue"),
          content: orderDetails?.product?.price,
        },
        {
          id: 2,
          title: t("detailsModal.services.gift_cards.code"),
          content: orderDetails?.gift_code,
        },
        {
          id: 3,
          title: t("detailsModal.services.gift_cards.note"),
          content: orderDetails?.note,
        },
      ],
    },

    {
      id: 5,
      service: "add_game_to_account",
      items: [
        {
          id: 1,
          title: t("detailsModal.services.add_game_to_account.gameName"),
          content: orderDetails?.product?.title,
        },
        {
          id: 2,
          title: t("detailsModal.services.add_game_to_account.loginData"),
          content: orderDetails?.login_data,
        },
        {
          id: 3,
          title: t("detailsModal.services.add_game_to_account.password"),
          content: orderDetails?.password,
        },
        {
          id: 4,
          title: t("detailsModal.services.add_game_to_account.note"),
          content: orderDetails?.note,
        },
      ],
    },
  ];

  const order = list.find((order) => order.service === orderDetails?.service);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:max-w-3xl">
        <ScrollArea
          className="max-h-[90vh] px-2"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {isLoading ? (
            <DetailsModalSkeleton />
          ) : (
            <>
              <DialogHeader className={`mb-4`}>
                <DialogTitle className={`text-center`}>
                  {t("detailsModal.title")}
                </DialogTitle>
                <DialogDescription className={`mt-2`}>
                  <img
                    loading="lazy"
                    src={orderDetails?.product?.game_image}
                    alt="order"
                    className="w-full aspect-video object-cover rounded-xl"
                  />
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                {order?.items?.length ? (
                  order.items
                    .filter((item) => item.content)
                    .map((item) => (
                      <div key={item.id}>
                        <h3 className="text-muted-foreground font-bold mb-1">
                          {item.title}
                        </h3>

                        <div
                          className="card"
                          dangerouslySetInnerHTML={{ __html: item?.content }}
                        />
                      </div>
                    ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    {t("detailsModal.noDetails")}
                  </p>
                )}
              </div>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsModal;

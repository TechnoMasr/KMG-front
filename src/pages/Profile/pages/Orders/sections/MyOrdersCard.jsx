import { Button } from "@/components/ui/button";
import { BsChatLeftText } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { FaCheckCircle, FaBook, FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { sendMsg } from "@/services/chatServices";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DetailsModal from "./DetailsModal";
import { useTranslation } from "react-i18next";

const MyOrdersCard = ({ order }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sendOrderToChat = useMutation({
    mutationFn: sendMsg,
    onSuccess: () => {
      queryClient.invalidateQueries(["get_msgs"]);
      setChatDialogOpen(false);
      setMessage("");
      navigate("/chat");
    },
    onError: (error) => {
      console.error("Error sending order to chat:", error);
    },
  });

  const handleSendToChat = () => {
    const formData = new FormData();
    formData.append("order_id", order.id);
    formData.append("message", message || "__");

    sendOrderToChat.mutate(formData);
  };

  return (
    <>
      <div className="card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-2 lg:gap-4">
          <div className="w-24 lg:w-36 aspect-square overflow-hidden rounded-2xl">
            <img
              loading="lazy"
              src={order?.product?.game_icon}
              alt="image"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-2 max-w-sm flex-1">
            <h3 className="text-lg font-bold">{order?.product?.title}</h3>
            <p className="text-muted-foreground text-sm">
              {t("myOrdersCard.messageDialog.orderCode")} {order.order_code}
            </p>
            <p className="text-lg font-bold">
              {order?.product?.price} {order?.currency}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={() => setChatDialogOpen(true)}
            className="w-full gap-2"
          >
            {t("myOrdersCard.buttons.chat")}
            <BsChatLeftText />
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant={`outline`} className="gap-2 rounded-full">
              <FaCheckCircle />
              {order.status}
            </Badge>

            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="gap-2 rounded-full"
            >
              <FaBook />
              {t("myOrdersCard.buttons.details")}
            </Button>

            <DetailsModal
              open={open}
              onClose={() => setOpen(false)}
              order_id={order.id}
            />
          </div>
        </div>
      </div>

      {/* Chat Dialog */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className={`text-center!`}>
            <DialogTitle>{t("myOrdersCard.messageDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("myOrdersCard.messageDialog.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Order Details */}
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <img
                  loading="lazy"
                  src={order?.product?.game_icon}
                  alt={order?.product?.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{order?.product?.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.order_code}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("myOrdersCard.messageDialog.price")}
                </span>
                <span className="font-bold">
                  {order?.total_price} {order?.currency}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("myOrdersCard.messageDialog.status")}
                </span>
                <Badge variant="outline" className="gap-1">
                  <FaCheckCircle size={14} />
                  {order.status}
                </Badge>
              </div>

              {order?.product?.platforms &&
                order.product.platforms.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t("myOrdersCard.messageDialog.platforms")}
                    </span>
                    <div className="flex gap-1">
                      {order.product.platforms.map((platform) => (
                        <img
                          loading="lazy"
                          key={platform.id}
                          src={platform.icon}
                          alt={platform.name}
                          className="w-6 h-6 rounded"
                          title={platform.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Label htmlFor="message">
                {t("myOrdersCard.messageDialog.yourMessage")}
              </Label>
              <Input
                id="message"
                placeholder={t("myOrdersCard.messageDialog.messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !sendOrderToChat.isPending) {
                    handleSendToChat();
                  }
                }}
                disabled={sendOrderToChat.isPending}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChatDialogOpen(false)}
              disabled={sendOrderToChat.isPending}
            >
              {t("myOrdersCard.messageDialog.cancel")}
            </Button>
            <Button
              onClick={handleSendToChat}
              disabled={sendOrderToChat.isPending}
              className="gap-2"
            >
              {sendOrderToChat.isPending ? (
                <>
                  {t("myOrdersCard.messageDialog.sending")}
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                </>
              ) : (
                <>
                  {t("myOrdersCard.messageDialog.send")}
                  <FaPaperPlane size={16} />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyOrdersCard;

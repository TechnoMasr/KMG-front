import { useTranslation } from "react-i18next";
import VodafoneCashForm from "../forms/VodafoneCashForm";
import InstaPayForm from "../forms/InstaPayForm";
import PaypalForm from "../forms/PaypalForm";
import BinancePayForm from "../forms/BinancePayForm";

const PaymentCard = ({ currentPayment, cancelPayment, state }) => {
  const { t } = useTranslation();

  if (!currentPayment) return null;

  const price = parseFloat(state?.product_price);
  const amount = parseFloat(currentPayment.amount);
  const serviceFee = parseFloat(currentPayment.service_fee);
  // 1️⃣ حساب النسبة المئوية من السعر
  const serviceFeeValue = (price * serviceFee) / 100;
  // 2️⃣ جمع النسبة المئوية مع القيمة الثابتة
  const extraFees = serviceFeeValue + amount;
  // 3️⃣ السعر النهائي
  const finalPrice = price + extraFees;

  return (
    <div className="flex flex-col gap-4 card w-full md:max-w-sm h-fit">
      <ul className="flex flex-col divide-y-2 text-sm">
        <li className="flex justify-between gap-2 py-1 text-muted-foreground">
          <p>{t("paymentCard.totalPrice")}</p>
          <span>
            {price} {state?.currency}
          </span>
        </li>
        <li className="flex justify-between gap-2 py-1 text-muted-foreground">
          <p>{t("paymentCard.serviceFee")}</p>
          <span>
            {extraFees} {state?.currency}
          </span>
        </li>
        <li className="flex justify-between gap-2 py-1">
          <p>{t("paymentCard.finalPrice")}</p>
          <span>
            {finalPrice} {state?.currency}
          </span>
        </li>
      </ul>

      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold mb-2">{currentPayment.title}</h3>

        <div className="w-16 aspect-video overflow-hidden rounded">
          <img
            loading="lazy"
            src={currentPayment.image}
            alt={currentPayment.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div>
        {currentPayment.paymentMethod === "online" && <div></div>}
        {currentPayment.paymentMethod === "vodafone_cash" && (
          <VodafoneCashForm
            cancelPayment={cancelPayment}
            currentPayment={currentPayment}
            state={state}
          />
        )}
        {currentPayment.paymentMethod === "instapay" && (
          <InstaPayForm
            cancelPayment={cancelPayment}
            currentPayment={currentPayment}
            state={state}
          />
        )}
        {currentPayment.paymentMethod === "paypal" && (
          <PaypalForm
            cancelPayment={cancelPayment}
            currentPayment={currentPayment}
            state={state}
          />
        )}
        {currentPayment.paymentMethod === "binance_pay" && (
          <BinancePayForm
            cancelPayment={cancelPayment}
            currentPayment={currentPayment}
            state={state}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentCard;

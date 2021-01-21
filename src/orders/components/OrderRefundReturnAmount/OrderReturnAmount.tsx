import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { defineMessages } from "react-intl";

import { OrderReturnFormData } from "../OrderReturnPage/form";
import { OrderRefundAmountCalculationMode } from "../OrderReturnPage/utils";
import OrderReturnRefundAmount from "./OrderRefundReturnAmount";
import { isItemSelected, isProperManualAmount } from "./utils";
import useReturnAmountCalculator from "./utils/ReturnAmountCalculator";

const messages = defineMessages({
  cannotBeFulfilled: {
    defaultMessage: "Returned items can't be fulfilled",
    description: "order return subtitle"
  },
  submitButton: {
    defaultMessage: "Return & Replace products",
    description: "order return amount button"
  }
});

export interface OrderReturnAmountProps {
  order: OrderDetails_order;
  formData: OrderReturnFormData;
  onChange: (event: React.ChangeEvent<any>) => void;
  onSubmit: () => void;
}

const OrderReturnAmount: React.FC<OrderReturnAmountProps> = ({
  order,
  formData,
  onChange,
  onSubmit
}) => {
  const { noRefund, amountCalculationMode } = formData;

  const amountCalculator = useReturnAmountCalculator(order, formData);
  const amountValues = amountCalculator.getCalculatedValues();

  const hasProperRefundAmount = () => {
    if (noRefund) {
      return true;
    }

    if (amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC) {
      return !!amountValues.refundTotalAmount.amount;
    }

    return isProperManualAmount(amountValues, formData);
  };

  return (
    <OrderReturnRefundAmount
      amountData={amountCalculator.getCalculatedValues()}
      submitDisabled={!hasProperRefundAmount()}
      messages={messages}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default OrderReturnAmount;

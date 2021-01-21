import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { defineMessages } from "react-intl";

import { OrderReturnFormData } from "../OrderReturnPage/form";
import OrderReturnRefundAmount from "./OrderRefundReturnAmount";
import { isItemSelected } from "./utils";
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
  const { fulfilledItemsQuantities, unfulfilledItemsQuantities } = formData;

  const amountCalculator = useReturnAmountCalculator(order, formData);

  const hasAnyItemsSelected =
    fulfilledItemsQuantities.some(isItemSelected) ||
    unfulfilledItemsQuantities.some(isItemSelected);

  return (
    <OrderReturnRefundAmount
      amountData={amountCalculator.getCalculatedValues()}
      submitDisabled={!hasAnyItemsSelected}
      messages={messages}
      onChange={change}
      onSubmit={onSubmit}
    />
  );
};

export default OrderReturnAmount;

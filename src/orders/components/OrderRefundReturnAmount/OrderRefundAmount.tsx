import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { defineMessages } from "react-intl";
import { OrderRefundAmountCalculationMode, OrderRefundFormData, OrderRefundType } from "../OrderRefundPage/form";

import OrderReturnRefundAmount from "./OrderRefundReturnAmount";
import useRefundAmountCalculator from "./utils/RefundAmountCalculator";

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

export interface OrderRefundAmountProps {
  order: OrderDetails_order;
  formData: OrderRefundFormData;
  onChange: (event: React.ChangeEvent<any>) => void;
  onSubmit: () => void;
}

const OrderRefundAmount: React.FC<OrderRefundAmountProps> = ({
  order,
  formData,
  onChange,
  onSubmit
}) => {
  const { type, amountCalculationMode } = formData
  const amountCalculator = useRefundAmountCalculator(order, formData);
  const amountData = amountCalculator.getCalculatedValues()

  const hasProperRefundAmount = () => {
    if(type === OrderRefundType.MISCELLANEOUS) { return true }

    if(amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC) {
      return 
    }
    ? refundTotalAmount?.amount
    : data.amount
  }

  const shouldDisableSubmit = !

  return (
    <OrderReturnRefundAmount
      // isReturn
      // amountData={amountCalculator.getCalculatedValues()}
      // data={data}
      // order={order}
      // disableSubmitButton={!hasAnyItemsSelected}
      // disabled={loading}
      // errors={errors}
      submitDisabled={!hasAnyItemsSelected}
      messages={messages}
      onChange={change}
      onSubmit={onSubmit}
    />
  );
};

export default OrderRefundAmount;

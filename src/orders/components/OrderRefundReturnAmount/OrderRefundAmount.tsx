import { IMoney } from "@saleor/components/Money";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";

import {
  OrderRefundAmountCalculationMode,
  OrderRefundFormData,
  OrderRefundType
} from "../OrderRefundPage/form";
import OrderReturnRefundAmount from "./OrderRefundReturnAmount";
import SubmitButton from "./SubmitButton";
import { isProperManualAmount } from "./utils";
import useRefundAmountCalculator from "./utils/RefundAmountCalculator";

const messages = defineMessages({
  cannotBeFulfilled: {
    defaultMessage: "Refunded items can't be fulfilled",
    description: "order return subtitle"
  },
  submitButton: {
    defaultMessage: "Refund {currency} {amount}",
    description: "order refund submit button"
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
  const { type, amountCalculationMode } = formData;
  const amountCalculator = useRefundAmountCalculator(order, formData);
  const intl = useIntl();

  const productsAmountValues = amountCalculator.getCalculatedProductsAmountValues();
  const miscellaneousAmountValues = amountCalculator.getMiscellanousAmountValues();

  const hasProperRefundAmount = (): boolean => {
    if (type === OrderRefundType.MISCELLANEOUS) {
      return true;
    }

    if (amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC) {
      return !!productsAmountValues.refundTotalAmount.amount;
    }

    return isProperManualAmount(productsAmountValues, formData);
  };

  const getSubmitButtonTextValues = (): IMoney =>
    type === OrderRefundType.MISCELLANEOUS
      ? miscellaneousAmountValues.maxRefundAmount
      : productsAmountValues.selectedProductsAmount;

  return (
    <OrderReturnRefundAmount
      // errors={errors}
      onChange={onChange}
    >
      <SubmitButton
        formData={formData}
        onSubmit={onSubmit}
        disabled={!hasProperRefundAmount}
        buttonText={intl.formatMessage(
          messages.submitButton,
          getSubmitButtonTextValues()
        )}
        helperText={intl.formatMessage(messages.cannotBeFulfilled)}
      />
    </OrderReturnRefundAmount>
  );
};

export default OrderRefundAmount;

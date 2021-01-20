import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";

import { OrderRefundFormData } from "../../OrderRefundPage/form";
import { refundFulfilledStatuses } from "../../OrderReturnPage/utils/FulfillmentsParser";
import AmountValuesCalculator from "./ReturnRefundAmountCalculator";
import {
  OrderRefundAmountValues,
  OrderRefundMiscellaneousAmountValues
} from "./types";

export class RefundAmountValuesCalculator extends AmountValuesCalculator {
  protected formData: OrderRefundFormData;

  public getCalculatedProductsAmountValues = (): OrderRefundAmountValues => ({
    ...this.getCommonCalculatedAmountValues(),
    ...this.getMiscellanousAmountValues(),
    selectedProductsAmount: this.getSelectedProductsAmount(
      refundFulfilledStatuses
    )
  });

  public getMiscellanousAmountValues = (): OrderRefundMiscellaneousAmountValues => ({
    authorizedAmount: this.getAuthorizedAmount(),
    maxRefund: this.getMaxRefundAmount(),
    previouslyRefunded: this.getPreviouslyRefundedAmount()
  });
}

const useRefundAmountCalculator = (
  order: OrderDetails_order,
  formData: OrderRefundFormData
) => new RefundAmountValuesCalculator(order, formData);

export default useRefundAmountCalculator;

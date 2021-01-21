/* eslint-disable @typescript-eslint/member-ordering */
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";

import { OrderRefundFormData } from "../../OrderRefundPage/form";
import { refundFulfilledStatuses } from "../../OrderReturnPage/utils/FulfillmentsParser";
import AmountValuesCalculator from "./ReturnRefundAmountCalculator";
import {
  OrderRefundAmountValues,
  OrderRefundMiscellaneousAmountValues
} from "./types";

export class RefundAmountValuesCalculator extends AmountValuesCalculator<
  OrderRefundFormData
> {
  public getCalculatedProductsAmountValues = (): OrderRefundAmountValues => ({
    ...this.getCommonCalculatedAmountValues(),
    ...this.getMiscellanousAmountValues(),
    refundTotalAmount: this.getTotalAmount(
      this.getRefundSelectedProductsAmount()
    ),
    selectedProductsAmount: this.getRefundSelectedProductsAmount()
  });

  private getRefundSelectedProductsAmount = () =>
    this.getSelectedProductsAmount(refundFulfilledStatuses);

  public getMiscellanousAmountValues = (): OrderRefundMiscellaneousAmountValues => ({
    authorizedAmount: this.getAuthorizedAmount(),
    maxRefundAmount: this.getMaxRefundAmount(),
    previouslyRefundedAmount: this.getPreviouslyRefundedAmount()
  });
}

const useRefundAmountCalculator = (
  order: OrderDetails_order,
  formData: OrderRefundFormData
) => new RefundAmountValuesCalculator(order, formData);

export default useRefundAmountCalculator;

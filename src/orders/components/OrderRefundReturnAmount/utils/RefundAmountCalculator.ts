import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";

import {
  OrderRefundFormData,
  OrderRefundType
} from "../../OrderRefundPage/form";
import { refundFulfilledStatuses } from "../../OrderReturnPage/utils/FulfillmentsParser";
import AmountValuesCalculator from "./ReturnRefundAmountCalculator";
import {
  OrderRefundAmountValues,
  OrderRefundMiscellaneousAmountValues
} from "./types";

type ValuesType =
  | OrderRefundAmountValues
  | OrderRefundMiscellaneousAmountValues;

export class RefundAmountValuesCalculator extends AmountValuesCalculator<
  OrderRefundFormData
> {
  public getCalculatedValues = function<ValuesType>(): ValuesType {
    return this.formData.type === OrderRefundType.PRODUCTS
      ? this.getCalculatedProductsAmountValues()
      : this.getMiscellanousAmountValues();
  };

  private getCalculatedProductsAmountValues = (): OrderRefundAmountValues => ({
    ...this.getCommonCalculatedAmountValues(),
    ...this.getMiscellanousAmountValues(),
    selectedProductsAmount: this.getSelectedProductsAmount(
      refundFulfilledStatuses
    )
  });

  private getMiscellanousAmountValues = (): OrderRefundMiscellaneousAmountValues => ({
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

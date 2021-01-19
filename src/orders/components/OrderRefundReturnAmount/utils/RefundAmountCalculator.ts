import { refundFulfilledStatuses } from "../../OrderReturnPage/utils";
import AmountValuesCalculator from "./ReturnRefundAmountCalculator";
import {
  OrderRefundAmountValues,
  OrderRefundMiscellaneousAmountValues
} from "./types";

export class RefundAmountValuesCalculator extends AmountValuesCalculator {
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

/* eslint-disable @typescript-eslint/member-ordering */
import { OrderReturnFormData } from "../../OrderReturnPage/form";
import { returnFulfilledStatuses } from "../../OrderReturnPage/utils";
import AmountValuesCalculator from "./ReturnRefundAmountCalculator";
import { OrderReturnAmountValues } from "./types";

export class ReturnAmountValuesCalculator extends AmountValuesCalculator {
  formData: OrderReturnFormData;

  public getCalculatedValues = (): OrderReturnAmountValues => ({
    ...this.getCommonCalculatedAmountValues(),
    maxRefund: this.getMaxRefundAmount(),
    replacedProductsAmount: this.getReplacedProductsAmount(),
    selectedProductsAmount: this.getSelectedProductsAmount(
      returnFulfilledStatuses,
      this.formData.itemsToBeReplaced
    )
  });

  private getReplacedProductsAmount = () => {
    const { itemsToBeReplaced } = this.formData;

    if (!itemsToBeReplaced.length) {
      return this.getZeroAmount();
    }

    const amount = itemsToBeReplaced.reduce(
      (
        resultAmount: number,
        { id, value: isItemToBeReplaced, data: { isFulfillment, isRefunded } }
      ) => {
        if (!isItemToBeReplaced || isRefunded) {
          return resultAmount;
        }

        const { unitPrice, selectedQuantity } = this.selectItemPriceAndQuantity(
          id,
          isFulfillment,
          returnFulfilledStatuses
        );

        return resultAmount + unitPrice.amount * selectedQuantity;
      },
      0
    );

    return this.getValueAsMoney(amount);
  };
}

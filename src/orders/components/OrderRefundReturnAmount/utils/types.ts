import { IMoney } from "@saleor/components/Money";

import { OrderRefundAmountCalculationMode } from "../../OrderRefundPage/form";
import { FormsetQuantityData } from "../../OrderReturnPage/form";

export interface OrderRefundMiscellaneousAmountValues {
  authorizedAmount: IMoney;
  previouslyRefunded: IMoney;
  maxRefund: IMoney;
}

export type OrderRefundAmountValues = OrderRefundMiscellaneousAmountValues &
  ReturnRefundCommonAmountValues & {
    selectedProductsAmount: IMoney;
  };

export interface ReturnRefundCommonAmountValues {
  previouslyRefunded: IMoney;
  authorizedAmount: IMoney;
  shipmentCost: IMoney;
}

export interface OrderReturnAmountValues extends OrderRefundAmountValues {
  replacedProductsAmount: IMoney;
  selectedProductsAmount: IMoney;
}

export interface OrderReturnRefundCommonFormData {
  amount: number;
  refundShipmentCosts: boolean;
  amountCalculationMode: OrderRefundAmountCalculationMode;
  unfulfilledItemsQuantities: FormsetQuantityData;
  fulfilledItemsQuantities: FormsetQuantityData;
}

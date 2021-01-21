import { IMoney } from "@saleor/components/Money";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import { MessageDescriptor } from "react-intl";

import { OrderRefundAmountCalculationMode } from "../../OrderRefundPage/form";

export interface OrderRefundMiscellaneousAmountValues {
  authorizedAmount: IMoney;
  previouslyRefundedAmount: IMoney;
  maxRefundAmount: IMoney;
}

export type OrderRefundAmountValues = OrderRefundMiscellaneousAmountValues &
  ReturnRefundCommonAmountValues & {
    selectedProductsAmount: IMoney;
    refundTotalAmount: IMoney;
  };

export interface ReturnRefundCommonAmountValues {
  maxRefundAmount: IMoney;
  previouslyRefunded: IMoney;
  authorizedAmount: IMoney;
  shipmentCost: IMoney;
}

export interface OrderReturnAmountValues extends OrderRefundAmountValues {
  replacedProductsAmount: IMoney;
  selectedProductsAmount: IMoney;
}

export interface OrderReturnRefundCommonFormData {
  manualAmount: number;
  refundShipmentCosts: boolean;
  amountCalculationMode: OrderRefundAmountCalculationMode;
  unfulfilledItemsQuantities: FormsetQuantityData;
  fulfilledItemsQuantities: FormsetQuantityData;
}
export interface LineItemOptions<T> {
  initialValue: T;
  isFulfillment?: boolean;
  isRefunded?: boolean;
}

export interface LineItemData {
  isFulfillment: boolean;
  isRefunded: boolean;
}

export type FormsetQuantityChange = FormsetChange<number>;
export type FormsetReplacementChange = FormsetChange<number>;

export type FormsetQuantityData = FormsetData<LineItemData, number>;
export type FormsetReplacementData = FormsetData<LineItemData, boolean>;

export interface OrderReturnData {
  amount: number;
  refundShipmentCosts: boolean;
  amountCalculationMode: OrderRefundAmountCalculationMode;
  noRefund: boolean;
}

export interface OrderReturnRefundCommonHandlers {
  changeFulfilledItemsQuantity: FormsetQuantityChange;
  changeUnfulfilledItemsQuantity: FormsetQuantityChange;
  handleSetMaximalFulfiledItemsQuantities: (fulfillmentId: string) => void;
  handleSetMaximalUnfulfiledItemsQuantities: () => void;
}

export type OrderReturnRefundAmountMessages = Record<
  "submitButton" | "cannotBeFulfilled",
  MessageDescriptor
>;

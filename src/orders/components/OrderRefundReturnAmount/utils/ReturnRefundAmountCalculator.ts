/* eslint-disable @typescript-eslint/member-ordering */
import { IMoney, subtractMoney } from "@saleor/components/Money";
import { FormsetData } from "@saleor/hooks/useFormset";
import {
  OrderDetails_order,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

import {
  FormsetReplacementData,
  LineItemData
} from "../../OrderReturnPage/form";
import {
  getById,
  ReturnRefundFulfillmentsParser
} from "../../OrderReturnPage/utils";
import {
  OrderReturnRefundCommonFormData,
  ReturnRefundCommonAmountValues
} from "./types";

export default class AmountValuesCalculator {
  protected order: OrderDetails_order;
  protected formData: OrderReturnRefundCommonFormData;
  protected defaultCurrency: string;

  constructor(
    order: OrderDetails_order,
    formData: OrderReturnRefundCommonFormData
  ) {
    this.order = order;
    this.formData = formData;
    this.defaultCurrency = order.totalBalance.currency;
  }

  protected getCommonCalculatedAmountValues = (): ReturnRefundCommonAmountValues => ({
    authorizedAmount: this.getAuthorizedAmount(),
    previouslyRefunded: this.getPreviouslyRefundedAmount(),
    shipmentCost: this.getShipmentCost()
  });

  protected getTotalAmount = (selectedProductsAmount: IMoney): IMoney => {
    if (this.getMaxRefundAmount().amount === 0) {
      return this.getZeroAmount();
    }

    if (this.shouldRefundShipmentCosts()) {
      return this.getValueAsMoney(
        selectedProductsAmount.amount + this.getShipmentCost().amount
      );
    }

    return selectedProductsAmount;
  };

  protected getShipmentCost = () =>
    this.ensureAmount(this.order.shippingPrice?.gross);

  protected ensureAmount = (money?: IMoney): IMoney => {
    if (!money) {
      return this.getZeroAmount();
    }

    return money;
  };

  protected getValueAsMoney = (value: number): IMoney => ({
    amount: value,
    currency: this.defaultCurrency
  });

  protected getZeroAmount = () => this.getValueAsMoney(0);

  protected shouldRefundShipmentCosts = () => this.formData.refundShipmentCosts;

  protected getAuthorizedAmount = (): IMoney =>
    this.ensureAmount(this.order.total?.gross);

  protected getMaxRefundAmount = (): IMoney =>
    this.ensureAmount(this.order.totalCaptured);

  protected getPreviouslyRefundedAmount = (): IMoney =>
    this.ensureAmount(this.getCalculatedPreviouslyRefundedPrice());

  protected getCalculatedPreviouslyRefundedPrice = (): IMoney =>
    this.order?.totalCaptured &&
    this.order?.total?.gross &&
    subtractMoney(this.order?.totalCaptured, this.order?.total?.gross);

  protected selectItemPriceAndQuantity = (
    id: string,
    isFulfillment: boolean,
    fulfilledStatuses: FulfillmentStatus[]
  ) => {
    const parser = new ReturnRefundFulfillmentsParser(
      this.order,
      fulfilledStatuses
    );

    return isFulfillment
      ? this.getItemPriceAndQuantity({
          id,
          itemsQuantities: this.formData.fulfilledItemsQuantities,
          orderLines: parser.getOrderFulfilledParsedLines()
        })
      : this.getItemPriceAndQuantity({
          id,
          itemsQuantities: this.formData.unfulfilledItemsQuantities,
          orderLines: this.order.lines
        });
  };

  protected getItemPriceAndQuantity = ({
    orderLines,
    itemsQuantities,
    id
  }: {
    orderLines: OrderDetails_order_lines[];
    itemsQuantities: FormsetData<LineItemData, number>;
    id: string;
  }) => {
    const { unitPrice } = orderLines.find(getById(id));
    const selectedQuantity = itemsQuantities.find(getById(id))?.value;

    return { selectedQuantity, unitPrice: this.ensureAmount(unitPrice.gross) };
  };

  protected getSelectedProductsAmount = (
    fulfilledStatuses: FulfillmentStatus[],
    itemsToBeReplaced: FormsetReplacementData = []
  ) => {
    const parser = new ReturnRefundFulfillmentsParser(
      this.order,
      fulfilledStatuses
    );

    const {
      unfulfilledItemsQuantities,
      fulfilledItemsQuantities
    } = this.formData;

    const unfulfilledItemsValue = this.getPartialProductsValue({
      itemsQuantities: unfulfilledItemsQuantities,
      itemsToBeReplaced,
      orderLines: this.order.lines
    });

    const fulfiledItemsValue = this.getPartialProductsValue({
      itemsQuantities: fulfilledItemsQuantities,
      itemsToBeReplaced,
      orderLines: parser.getOrderFulfilledParsedLines()
    });

    return this.getValueAsMoney(unfulfilledItemsValue + fulfiledItemsValue);
  };

  protected getPartialProductsValue = ({
    orderLines,
    itemsQuantities,
    itemsToBeReplaced
  }: {
    itemsToBeReplaced: FormsetData<LineItemData, boolean>;
    itemsQuantities: FormsetData<LineItemData, number>;
    orderLines: OrderDetails_order_lines[];
  }) =>
    itemsQuantities.reduce((resultAmount, { id, value: quantity }) => {
      const {
        value: isItemToBeReplaced,
        data: { isRefunded }
      } = itemsToBeReplaced.find(getById(id));

      if (quantity < 1 || isItemToBeReplaced || isRefunded) {
        return resultAmount;
      }

      const { selectedQuantity, unitPrice } = this.getItemPriceAndQuantity({
        id,
        itemsQuantities,
        orderLines
      });

      return resultAmount + unitPrice.amount * selectedQuantity;
    }, 0);
}

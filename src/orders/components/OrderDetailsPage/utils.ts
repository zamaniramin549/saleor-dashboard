import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";

import {
  returnFulfilledStatuses,
  ReturnRefundFulfillmentsParser
} from "../OrderReturnPage/utils/FulfillmentsParser";

export const hasAnyItemsReplaceable = (order?: OrderDetails_order) => {
  if (!order) {
    return false;
  }

  const parser = new ReturnRefundFulfillmentsParser(
    order,
    returnFulfilledStatuses
  );

  const hasAnyUnfulfilledItems = parser.getUnfulfilledLines().length > 0;

  const hasAnyFulfilmentsToReturn =
    parser.getFulfilledFulfillemnts().length > 0;

  return hasAnyUnfulfilledItems || hasAnyFulfilmentsToReturn;
};

export interface ConditionalItem {
  shouldExist: boolean;
  item: any;
}

export const filteredConditionalItems = (items: ConditionalItem[]) =>
  items.filter(({ shouldExist }) => shouldExist).map(({ item }) => item);

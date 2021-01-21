import { UseFormsetOutput } from "@saleor/hooks/useFormset";
import {
  OrderDetails_order_fulfillments_lines,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import reduce from "lodash/reduce";

import { OrderRefundAmountCalculationMode } from "../../OrderRefundPage/form";
import { LineItemData } from "../../OrderRefundReturnAmount/utils/types";
import { ReturnLineDataParser } from "./ReturnLineDataParser";

export const getById = (idToCompare: string) => (obj: { id: string }) =>
  obj.id === idToCompare;

export const getItemsWithMaxedQuantities = (
  itemsQuantities: UseFormsetOutput<LineItemData, number>,
  lines: OrderDetails_order_lines[] | OrderDetails_order_fulfillments_lines[]
) =>
  itemsQuantities.data.map(item => {
    const { id } = item;
    const line = lines.find(getById(id));
    const newQuantity = line.quantity - line.quantityFulfilled;

    return ReturnLineDataParser.getLineItem(line, {
      ...item,
      initialValue: newQuantity
    });
  });

type handlerFunction = (...args: any[]) => void;

type Handlers = Record<string, handlerFunction>;

export const getHandlersWithTriggerChange = function<T extends Handlers>(
  handlers: Handlers,
  triggerChange: () => void
): T {
  return reduce(
    handlers,
    (resultHandlers, handlerFn, handlerName) => {
      const handlerWithTriggerChange = handleHandlerChange(
        triggerChange,
        handlerFn
      );
      return { ...resultHandlers, [handlerName]: handlerWithTriggerChange };
    },
    {} as T
  );
};

const handleHandlerChange = (
  triggerChange: () => void,
  callback: (...args: any[]) => void
) => (...args: []) => {
  triggerChange();
  callback(...args);
};

export const orderReturnRefundDefaultFormData = {
  amount: undefined,
  amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
  refundShipmentCosts: false
};

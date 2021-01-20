import reduce from "lodash/reduce";
import { ReturnLineDataParser } from "./ReturnLineDataParser";

export const getById = (idToCompare: string) => (obj: { id: string }) =>
  obj.id === idToCompare;

export const getItemsWithMaxedQuantities = ({ lines, itemsQuantites }) =>
  itemsQuantites.data.map(item => {
    const { id } = item;
    const line = lines.find(getById(id));
    const newQuantity = line.quantity - line.quantityFulfilled;

    return ReturnLineDataParser.getLineItem(line, {
      ...item,
      initialValue: newQuantity
    });
  });

export const getHandlersWithTriggerChange = (
  handlers: Record<string, Function>,
  triggerChange: () => void
) =>
  reduce(
    handlers,
    (resultHandlers, handlerFn, handlerName) => {
      const handlerWithTriggerChange = handleHandlerChange(handlerFn);
      return { ...resultHandlers, [handlerName]: handlerWithTriggerChange };
    },
    {}
  );

const handleHandlerChange = (callback: (...args: any[]) => void) => (
  ...args: []
) => {
  this.triggerChange();
  callback(...args);
};

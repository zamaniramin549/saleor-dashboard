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

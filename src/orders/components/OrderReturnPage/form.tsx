import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React, { useState } from "react";

import { OrderRefundAmountCalculationMode } from "../OrderRefundPage/form";
import { OrderReturnRefundCommonFormData } from "../OrderRefundReturnAmount/utils/types";
import {
  getById,
  returnFulfilledStatuses,
  ReturnLineDataParser
} from "./utils";

export interface LineItemOptions<T> {
  initialValue: T;
  isFulfillment?: boolean;
  isRefunded?: boolean;
}

export interface LineItemData {
  isFulfillment: boolean;
  isRefunded: boolean;
}

export type FormsetQuantityData = FormsetData<LineItemData, number>;
export type FormsetReplacementData = FormsetData<LineItemData, boolean>;

export interface OrderReturnData {
  amount: number;
  refundShipmentCosts: boolean;
  amountCalculationMode: OrderRefundAmountCalculationMode;
}

export interface OrderReturnHandlers {
  changeFulfilledItemsQuantity: FormsetChange<number>;
  changeUnfulfilledItemsQuantity: FormsetChange<number>;
  changeItemsToBeReplaced: FormsetChange<boolean>;
  handleSetMaximalFulfiledItemsQuantities;
  handleSetMaximalUnfulfiledItemsQuantities;
}

export interface OrderReturnFormData extends OrderReturnRefundCommonFormData {
  itemsToBeReplaced: FormsetReplacementData;
}

export type OrderRefundSubmitData = OrderReturnFormData;

export interface UseOrderRefundFormResult {
  change: FormChange;
  hasChanged: boolean;
  data: OrderReturnFormData;
  handlers: OrderReturnHandlers;
  submit: () => Promise<boolean>;
}

interface OrderReturnProps {
  children: (props: UseOrderRefundFormResult) => React.ReactNode;
  order: OrderDetails_order;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const getOrderRefundPageFormData = (): OrderReturnData => ({
  amount: undefined,
  amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
  refundShipmentCosts: false
});

function useOrderReturnForm(
  order: OrderDetails_order,
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise
): UseOrderRefundFormResult {
  const form = useForm(getOrderRefundPageFormData());
  const [hasChanged, setHasChanged] = useState(false);
  const parser = new ReturnLineDataParser(order, returnFulfilledStatuses);

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
  };

  const unfulfiledItemsQuantites = useFormset<LineItemData, number>(
    parser.getUnfulfilledParsedLineData({ initialValue: 0 })
  );

  const fulfiledItemsQuatities = useFormset<LineItemData, number>(
    parser.getFulfilledParsedLineData()
  );

  const itemsToBeReplaced = useFormset<LineItemData, boolean>(
    parser.getReplacableParsedLineData()
  );

  const handleSetMaximalUnfulfiledItemsQuantities = () => {
    const newQuantities: FormsetQuantityData = unfulfiledItemsQuantites.data.map(
      ({ id }) => {
        const line = order.lines.find(getById(id));
        const newQuantity = line.quantity - line.quantityFulfilled;

        return ReturnLineDataParser.getLineItem(line, {
          initialValue: newQuantity
        });
      }
    );

    triggerChange();
    unfulfiledItemsQuantites.set(newQuantities);
  };

  const handleSetMaximalFulfiledItemsQuantities = (
    fulfillmentId: string
  ) => () => {
    const { lines } = order.fulfillments.find(getById(fulfillmentId));

    const newQuantities: FormsetQuantityData = fulfiledItemsQuatities.data.map(
      item => {
        const line = lines.find(getById(item.id));

        return ReturnLineDataParser.getLineItem(line, {
          initialValue: line.quantity,
          isRefunded: item.data.isRefunded
        });
      }
    );

    triggerChange();
    fulfiledItemsQuatities.set(newQuantities);
  };

  const data: OrderReturnFormData = {
    fulfiledItemsQuantities: fulfiledItemsQuatities.data,
    itemsToBeReplaced: itemsToBeReplaced.data,
    unfulfiledItemsQuantities: unfulfiledItemsQuantites.data,
    ...form.data
  };

  const submit = () => handleFormSubmit(data, onSubmit, setHasChanged);

  const triggerChange = () => setHasChanged(true);

  function handleHandlerChange<T>(callback: (id: string, value: T) => void) {
    return (id: string, value: T) => {
      triggerChange();
      callback(id, value);
    };
  }

  return {
    change: handleChange,
    data,
    handlers: {
      changeFulfiledItemsQuantity: handleHandlerChange(
        fulfiledItemsQuatities.change
      ),
      changeItemsToBeReplaced: handleHandlerChange(itemsToBeReplaced.change),
      changeUnfulfiledItemsQuantity: handleHandlerChange(
        unfulfiledItemsQuantites.change
      ),
      handleSetMaximalFulfiledItemsQuantities,
      handleSetMaximalUnfulfiledItemsQuantities
    },
    hasChanged,
    submit
  };
}

const OrderReturnForm: React.FC<OrderReturnProps> = ({
  children,
  order,
  onSubmit
}) => {
  const props = useOrderReturnForm(order, onSubmit);

  return <form>{children(props)}</form>;
};

export default OrderReturnForm;

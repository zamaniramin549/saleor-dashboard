import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React, { useState } from "react";

import { OrderRefundAmountCalculationMode } from "../OrderRefundPage/form";
import {
  FormsetReplacementChange,
  FormsetReplacementData,
  LineItemData,
  OrderReturnData,
  OrderReturnRefundCommonFormData,
  OrderReturnRefundCommonHandlers
} from "../OrderRefundReturnAmount/utils/types";
import {
  getById,
  getHandlersWithTriggerChange,
  getItemsWithMaxedQuantities
} from "./utils";
import { returnFulfilledStatuses } from "./utils/FulfillmentsParser";
import { ReturnLineDataParser } from "./utils/ReturnLineDataParser";

export interface OrderReturnHandlers extends OrderReturnRefundCommonHandlers {
  changeItemsToBeReplaced: FormsetReplacementChange;
}

export interface OrderReturnFormData
  extends OrderReturnData,
    OrderReturnRefundCommonFormData {
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
  noRefund: false,
  refundShipmentCosts: false
});

function useOrderReturnForm(
  order: OrderDetails_order,
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise
): UseOrderRefundFormResult {
  const form = useForm(getOrderRefundPageFormData());
  const [hasChanged, setHasChanged] = useState(false);
  const parser = new ReturnLineDataParser(order, returnFulfilledStatuses);

  const triggerChange = () => setHasChanged(true);

  const handleChange: FormChange = (event, cb) => {
    triggerChange();
    form.change(event, cb);
  };

  const unfulfilledItemsQuantites = useFormset<LineItemData, number>(
    parser.getUnfulfilledParsedLineData({ initialValue: 0 })
  );

  const fulfilledItemsQuantities = useFormset<LineItemData, number>(
    parser.getFulfilledParsedLineData()
  );

  const itemsToBeReplaced = useFormset<LineItemData, boolean>(
    parser.getReplacableParsedLineData()
  );

  const handleSetMaximalUnfulfiledItemsQuantities = () =>
    unfulfilledItemsQuantites.set(
      getItemsWithMaxedQuantities({
        itemsQuantities: unfulfilledItemsQuantites,
        lines: order.lines
      })
    );

  const handleSetMaximalFulfiledItemsQuantities = (
    fulfillmentId: string
  ) => () =>
    fulfilledItemsQuantities.set(
      getItemsWithMaxedQuantities({
        isFulfillment: true,
        itemsQuantities: fulfilledItemsQuantities,
        lines: order.fulfillments.find(getById(fulfillmentId))?.lines
      })
    );

  const data: OrderReturnFormData = {
    fulfilledItemsQuantities: fulfilledItemsQuantities.data,
    itemsToBeReplaced: itemsToBeReplaced.data,
    unfulfilledItemsQuantities: unfulfilledItemsQuantites.data,
    ...form.data
  };

  const submit = () => handleFormSubmit(data, onSubmit, setHasChanged);

  const handlers = {
    changeFulfilledItemsQuantity: fulfilledItemsQuantities.change,
    changeItemsToBeReplaced: itemsToBeReplaced.change,
    changeUnfulfilledItemsQuantity: unfulfilledItemsQuantites.change,
    handleSetMaximalFulfiledItemsQuantities,
    handleSetMaximalUnfulfiledItemsQuantities
  };

  return {
    change: handleChange,
    data,
    handlers: getHandlersWithTriggerChange<OrderReturnHandlers>(
      handlers,
      triggerChange
    ),
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

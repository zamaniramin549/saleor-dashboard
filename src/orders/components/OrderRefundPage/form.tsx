import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React, { useState } from "react";

import { FormsetQuantityData, LineItemData } from "../OrderReturnPage/form";
import { refundFulfilledStatuses } from "../OrderReturnPage/utils";
import { RefundLineDataParser } from "./utils";

export enum OrderRefundType {
  MISCELLANEOUS = "miscellaneous",
  PRODUCTS = "products"
}
export enum OrderRefundAmountCalculationMode {
  AUTOMATIC = "automatic",
  MANUAL = "manual"
}

export interface OrderRefundData {
  amount: number | string;
  type: OrderRefundType;
  refundShipmentCosts: boolean;
  amountCalculationMode: OrderRefundAmountCalculationMode;
}

export interface OrderRefundHandlers {
  changeRefundedProductQuantity: FormsetChange<string>;
  setMaximalRefundedProductQuantities: () => void;
  changeRefundedFulfilledProductQuantity: FormsetChange<string>;
  setMaximalRefundedFulfilledProductQuantities: (fulfillmentId: string) => void;
}

export interface OrderRefundFormData extends OrderRefundData {
  unfulfilledItemsQuantities: FormsetQuantityData;
  fulfilledItemsQuantities: FormsetQuantityData;
}

export interface UseOrderRefundFormResult {
  change: FormChange;
  data: OrderRefundFormData;
  disabled: boolean;
  handlers: OrderRefundHandlers;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

interface OrderRefundFormProps {
  children: (props: UseOrderRefundFormResult) => React.ReactNode;
  order: OrderDetails_order;
  defaultType: OrderRefundType;
  onSubmit: (data: OrderRefundFormData) => SubmitPromise;
}

const getOrderRefundPageFormData = (
  defaultType: OrderRefundType
): OrderRefundData => ({
  amount: undefined,
  amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
  refundShipmentCosts: false,
  type: defaultType
});

function useOrderRefundForm(
  order: OrderDetails_order,
  defaultType: OrderRefundType,
  onSubmit: (data: OrderRefundFormData) => SubmitPromise
): UseOrderRefundFormResult {
  const [hasChanged, setHasChanged] = useState(false);
  const parser = new RefundLineDataParser(order, refundFulfilledStatuses);

  const form = useForm(getOrderRefundPageFormData(defaultType));

  const unfulfilledItemsQuantities = useFormset<LineItemData, number>(
    parser.getUnfulfilledParsedLineData({ initialValue: 0 })
  );
  const fulfilledItemsQuantities = useFormset<LineItemData, number>(
    parser.getFulfilledParsedLineData({ initialValue: 0 })
  );

  const handleRefundedProductQuantityChange: FormsetChange<string> = (
    id,
    value
  ) => {
    triggerChange();
    refundedProductQuantities.change(id, value);
  };
  const handleRefundedFulFilledProductQuantityChange = (
    id: string,
    value: string
  ) => {
    triggerChange();
    refundedFulfilledProductQuantities.change(id, value);
  };
  const handleMaximalRefundedProductQuantitiesSet = () => {
    const newQuantities: FormsetData<
      null,
      string
    > = refundedProductQuantities.data.map(selectedLine => {
      const line = order.lines.find(line => line.id === selectedLine.id);

      return {
        data: null,
        id: line.id,
        label: null,
        value: (line.quantity - line.quantityFulfilled).toString()
      };
    });
    refundedProductQuantities.set(newQuantities);
    triggerChange();
  };

  const handleMaximalRefundedFulfilledProductQuantitiesSet = (
    fulfillmentId: string
  ) => {
    const fulfillment = order.fulfillments.find(
      fulfillment => fulfillment.id === fulfillmentId
    );
    const newQuantities: FormsetData<
      null,
      string
    > = refundedFulfilledProductQuantities.data.map(selectedLine => {
      const line = fulfillment.lines.find(line => line.id === selectedLine.id);

      if (line) {
        return {
          data: null,
          id: line.id,
          label: null,
          value: line.quantity.toString()
        };
      }
      return selectedLine;
    });
    refundedFulfilledProductQuantities.set(newQuantities);
    triggerChange();
  };

  const data: OrderRefundFormData = {
    ...form.data,
    fulfilledItemsQuantities: fulfilledItemsQuantities.data,
    unfulfilledItemsQuantities: unfulfilledItemsQuantities.data
  };

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };

  const submit = () => handleFormSubmit(data, onSubmit, setChanged);

  const disabled = !order;

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
    disabled,
    handlers: {
      changeRefundedFulfilledProductQuantity: handleRefundedFulFilledProductQuantityChange,
      changeRefundedProductQuantity: handleRefundedProductQuantityChange,
      setMaximalRefundedFulfilledProductQuantities: handleMaximalRefundedFulfilledProductQuantitiesSet,
      setMaximalRefundedProductQuantities: handleMaximalRefundedProductQuantitiesSet
    },
    hasChanged,
    submit
  };
}

const OrderRefundForm: React.FC<OrderRefundFormProps> = ({
  children,
  order,
  defaultType,
  onSubmit
}) => {
  const props = useOrderRefundForm(order, defaultType, onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderRefundForm.displayName = "OrderRefundForm";
export default OrderRefundForm;

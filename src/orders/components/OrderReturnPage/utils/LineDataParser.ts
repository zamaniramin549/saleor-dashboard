/* eslint-disable @typescript-eslint/member-ordering */
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

import { LineItemOptions } from "../form";
import { ReturnRefundFulfillmentsParser } from "./FulfillmentsParser";

export type LineDataParserArgs = Parameters<
  (order: OrderDetails_order, fulfilledStatuses: FulfillmentStatus[]) => void
>;

export class LineDataParser {
  fulfillmentsParser: ReturnRefundFulfillmentsParser;

  constructor(
    order: OrderDetails_order,
    fulfilledStatuses: FulfillmentStatus[]
  ) {
    this.fulfillmentsParser = new ReturnRefundFulfillmentsParser(
      order,
      fulfilledStatuses
    );
  }

  getUnfulfilledParsedLineData = function<T>(options: LineItemOptions<T>) {
    return this.fulfillmentsParser
      .getUnfulfilledLines()
      .map(LineDataParser.getParsedLineData(options));
  };

  static getParsedLineData = function<T>({
    initialValue,
    isFulfillment = false,
    isRefunded = false
  }: LineItemOptions<T>) {
    return (item: { id: string }) =>
      LineDataParser.getLineItem(item, {
        initialValue,
        isFulfillment,
        isRefunded
      });
  };

  static getLineItem = function<T>(
    { id }: { id: string },
    {
      initialValue,
      isFulfillment = false,
      isRefunded = false
    }: LineItemOptions<T>
  ) {
    return {
      data: { isFulfillment, isRefunded },
      id,
      label: null,
      value: initialValue
    };
  };
}

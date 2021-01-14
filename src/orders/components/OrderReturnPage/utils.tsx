/* eslint-disable @typescript-eslint/member-ordering */
import {
  OrderDetails_order,
  OrderDetails_order_fulfillments
} from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

import { LineItemOptions } from "./form";

export const getById = (idToCompare: string) => (obj: { id: string }) =>
  obj.id === idToCompare;

export const refundFulfilledStatuses = [FulfillmentStatus.FULFILLED];
export const returnFulfilledStatuses = [
  FulfillmentStatus.REFUNDED,
  FulfillmentStatus.FULFILLED
];

export class ReturnRefundFulfillmentsParser {
  static defaultOrderValues: Partial<OrderDetails_order> = {
    fulfillments: [],
    lines: []
  };
  order: Partial<OrderDetails_order>;
  fulfilledStatuses: FulfillmentStatus[];

  constructor(
    order: OrderDetails_order,
    fulfilledStatuses: FulfillmentStatus[]
  ) {
    this.order = order || ReturnRefundFulfillmentsParser.defaultOrderValues;
    this.fulfilledStatuses = fulfilledStatuses;
  }

  private getOrderLines = () => this.order.lines;

  private getOrderFulfillments = () => this.order.fulfillments;

  isFulfillmentFulfilled = fulfillment =>
    this.fulfilledStatuses.includes(fulfillment.status);

  getFulfilledFulfillemnts = () =>
    this.getOrderFulfillments().filter(this.isFulfillmentFulfilled);

  getUnfulfilledLines = () =>
    this.getOrderLines().filter(
      ({ quantity, quantityFulfilled }) => quantity !== quantityFulfilled
    );

  getOrderFulfilledParsedLines = () =>
    ReturnRefundFulfillmentsParser.getParsedLinesOfFulfillments(
      this.getFulfilledFulfillemnts()
    );

  getAllOrderParsedLines = () =>
    ReturnRefundFulfillmentsParser.getParsedLinesOfFulfillments(
      this.getOrderFulfillments()
    );

  getParsedLinesOfFullfillmentsWithStatus = (
    fulfillmentStatus: FulfillmentStatus
  ) =>
    ReturnRefundFulfillmentsParser.getParsedLinesOfFulfillments(
      this.getFulfillmentsWithStatus(fulfillmentStatus)
    );

  getFulfillmentsWithStatus = (fulfillmentStatus: FulfillmentStatus) =>
    this.getOrderFulfillments().filter(
      ({ status }) => status === fulfillmentStatus
    );

  static getParsedLinesOfFulfillments = (
    fulfillments: OrderDetails_order_fulfillments[]
  ) =>
    fulfillments.reduce(
      (result, fulfillment) => [
        ...result,
        ...ReturnRefundFulfillmentsParser.getParsedLinesOfFulfillment(
          fulfillment
        )
      ],
      []
    );

  static getParsedLinesOfFulfillment = ({
    lines
  }: OrderDetails_order_fulfillments) =>
    lines.map(({ id, quantity, orderLine }) => ({
      ...orderLine,
      id,
      quantity
    }));
}

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
      .map(ReturnLineDataParser.getParsedLineData(options));
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

export class ReturnLineDataParser extends LineDataParser {
  constructor(...args: LineDataParserArgs) {
    super(...args);
  }

  getFulfilledParsedLineData = () => {
    const commonOptions = {
      initialValue: 0,
      isFulfillment: true
    };

    const refundedFulfilmentsItems = this.getParsedLineDataForFulfillmentStatus(
      FulfillmentStatus.REFUNDED,
      { ...commonOptions, isRefunded: true }
    );

    const fulfilledFulfillmentsItems = this.getParsedLineDataForFulfillmentStatus(
      FulfillmentStatus.FULFILLED,
      commonOptions
    );

    return refundedFulfilmentsItems.concat(fulfilledFulfillmentsItems);
  };

  getReplacableParsedLineData = () => {
    const orderLinesItems = this.getUnfulfilledParsedLineData({
      initialValue: false
    });

    const commonOptions = {
      initialValue: false,
      isFulfillment: true
    };

    const refundedFulfilmentsItems = this.getParsedLineDataForFulfillmentStatus(
      FulfillmentStatus.REFUNDED,
      commonOptions
    );

    const fulfilledFulfillmentsItems = this.getParsedLineDataForFulfillmentStatus(
      FulfillmentStatus.FULFILLED,
      commonOptions
    );

    return [
      ...orderLinesItems,
      ...refundedFulfilmentsItems,
      ...fulfilledFulfillmentsItems
    ];
  };

  getParsedLineDataForFulfillmentStatus = function<T>(
    fulfillmentStatus: FulfillmentStatus,
    lineItemOptions: LineItemOptions<T>
  ) {
    return this.fulfillmentsParser
      .getParsedLinesOfFullfillmentsWithStatus(fulfillmentStatus)
      .map(ReturnLineDataParser.getParsedLineData(lineItemOptions));
  };
}

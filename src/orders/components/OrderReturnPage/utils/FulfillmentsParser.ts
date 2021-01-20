/* eslint-disable @typescript-eslint/member-ordering */
import {
  OrderDetails_order,
  OrderDetails_order_fulfillments
} from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";

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

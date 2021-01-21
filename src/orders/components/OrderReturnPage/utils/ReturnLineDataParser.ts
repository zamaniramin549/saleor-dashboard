import { FulfillmentStatus } from "@saleor/types/globalTypes";

import { LineItemOptions } from "../../OrderRefundReturnAmount/utils/types";
import { LineDataParser, LineDataParserArgs } from "./LineDataParser";

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
      .map(LineDataParser.getParsedLineData(lineItemOptions));
  };
}

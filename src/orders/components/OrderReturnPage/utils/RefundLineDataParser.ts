/* eslint-disable @typescript-eslint/member-ordering */
import { LineItemOptions } from "../form";
import { LineDataParser, LineDataParserArgs } from "./LineDataParser";

export class RefundLineDataParser extends LineDataParser {
  constructor(...args: LineDataParserArgs) {
    super(...args);
  }

  getFulfilledParsedLineData = function<T>(options: LineItemOptions<T>) {
    return this.fulfillmentsParser
      .getOrderFulfilledParsedLines()
      .map(LineDataParser.getParsedLineData(options));
  };
}

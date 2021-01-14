import {
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@material-ui/core";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import {
  OrderDetails_order,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import React from "react";

import {
  FormsetQuantityData,
  FormsetReplacementData
} from "../OrderReturnPage/form";
import { getById } from "../OrderReturnPage/utils";
import CardTitle from "../OrderReturnRefundItemsCard/CardTitle";
import MaximalButton from "../OrderReturnRefundItemsCard/MaximalButton";
import ProductErrorCell from "../OrderReturnRefundItemsCard/ProductErrorCell";
import ProductNameCell from "../OrderReturnRefundItemsCard/ProductNameCell";
import ProductQuantityCell from "../OrderReturnRefundItemsCard/ProductQuantityCell";
import ReturnTableHeader from "./TableHeader";

interface OrderReturnRefundLinesCardProps {
  onChangeQuantity: FormsetChange<number>;
  fulfilmentId?: string;
  canReplace?: boolean;
  errors: OrderErrorFragment[];
  lines: OrderDetails_order_lines[];
  order: OrderDetails_order;
  itemsSelections: FormsetReplacementData;
  itemsQuantities: FormsetQuantityData;
  onChangeSelected: FormsetChange<boolean>;
  onSetMaxQuantity();
}

const ItemsCard: React.FC<OrderReturnRefundLinesCardProps> = ({
  lines,
  onSetMaxQuantity,
  onChangeQuantity,
  onChangeSelected,
  itemsSelections,
  itemsQuantities,
  fulfilmentId,
  order
}) => {
  const fulfillment = order?.fulfillments.find(getById(fulfilmentId));

  return (
    <Card>
      <CardTitle
        orderNumber={order?.number}
        lines={lines}
        fulfillmentOrder={fulfillment?.fulfillmentOrder}
        status={fulfillment?.status}
      />
      <MaximalButton onClick={onSetMaxQuantity} />
      <Table>
        <ReturnTableHeader />
        <TableBody>
          {renderCollection(
            lines,
            line => {
              const { id, unitPrice, variant } = line;

              const isRefunded = itemsQuantities.find(getById(id)).data
                .isRefunded;
              const isReplacable = !!variant && !isRefunded;
              const isReturnable = !!variant;
              const isSelected = itemsSelections.find(getById(id))?.value;

              return (
                <TableRow key={id}>
                  <ProductNameCell lines={lines} line={line} />
                  <ProductErrorCell hasVariant={isReturnable} />
                  <TableCell align="right">
                    <Money money={{ ...unitPrice.gross }} />
                  </TableCell>
                  <ProductQuantityCell
                    line={line}
                    itemsQuantities={itemsQuantities}
                    onChangeQuantity={onChangeQuantity}
                    fulfillmentId={fulfilmentId}
                    shouldDisplay={isReturnable}
                  />
                  <TableCell align="center">
                    {isReplacable && (
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onChangeSelected(id, !isSelected)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={4}>
                  <Skeleton />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ItemsCard;

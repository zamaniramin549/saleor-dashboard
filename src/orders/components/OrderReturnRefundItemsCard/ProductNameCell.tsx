import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { OrderDetails_order_lines } from "@saleor/orders/types/OrderDetails";
import React from "react";

interface ProductNameCellProps {
  lines: OrderDetails_order_lines[];
  line: OrderDetails_order_lines;
}

const ProductNameCell: React.FC<ProductNameCellProps> = ({ lines, line }) => {
  const { thumbnail, productName } = line;

  const anyLineWithoutVariant = lines.some(({ variant }) => !variant);
  const productNameCellWidth = anyLineWithoutVariant ? "30%" : "50%";

  return (
    <TableCellAvatar
      thumbnail={thumbnail?.url}
      style={{ width: productNameCellWidth }}
    >
      {productName || <Skeleton />}
    </TableCellAvatar>
  );
};

export default ProductNameCell;

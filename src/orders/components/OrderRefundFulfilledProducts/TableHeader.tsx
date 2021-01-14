import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage } from "react-intl";

const RefundTableHeader: React.FC = () => (
  <TableHead>
    <TableRow>
      <TableCell>
        <FormattedMessage
          defaultMessage="Product"
          description="tabel column header"
        />
      </TableCell>
      <TableCell>
        <FormattedMessage
          defaultMessage="Price"
          description="tabel column header"
        />
      </TableCell>
      <TableCell>
        <FormattedMessage
          defaultMessage="Refunded Qty"
          description="tabel column header"
        />
      </TableCell>
      <TableCell>
        <FormattedMessage
          defaultMessage="Total"
          description="tabel column header"
        />
      </TableCell>
    </TableRow>
  </TableHead>
);

export default RefundTableHeader;

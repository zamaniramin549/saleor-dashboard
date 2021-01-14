import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage } from "react-intl";

const ReturnTableHeader: React.FC = () => (
  <TableHead>
    <TableRow>
      <TableCell>
        <FormattedMessage
          defaultMessage="Product"
          description="table column header"
        />
      </TableCell>
      <TableCell />
      <TableCell align="right">
        <FormattedMessage
          defaultMessage="Price"
          description="table column header"
        />
      </TableCell>
      <TableCell align="right">
        <FormattedMessage
          defaultMessage="Return"
          description="table column header"
        />
      </TableCell>
      <TableCell align="center">
        <FormattedMessage
          defaultMessage="Replace"
          description="table column header"
        />
      </TableCell>
    </TableRow>
  </TableHead>
);

export default ReturnTableHeader;

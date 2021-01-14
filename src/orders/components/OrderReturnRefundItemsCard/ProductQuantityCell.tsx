import { makeStyles, TableCell, TextField } from "@material-ui/core";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { OrderDetails_order_lines } from "@saleor/orders/types/OrderDetails";
import React, { CSSProperties } from "react";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";

import { FormsetQuantityData } from "../OrderReturnPage/form";
import { getById } from "../OrderReturnPage/utils";

const useStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    };

    return {
      quantityInnerInput: {
        ...inputPadding
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap"
      }
    };
  },
  { name: "ProductQuantityCell" }
);

const messages = defineMessages({
  improperValue: {
    defaultMessage: "Improper value",
    description: "error message"
  }
});

interface ProductQuantityCellProps {
  line: OrderDetails_order_lines;
  itemsQuantities: FormsetQuantityData;
  onChangeQuantity: FormsetChange<number>;
  fulfillmentId?: string;
  shouldDisplay: boolean;
}

const ProductQuantityCell: React.FC<ProductQuantityCellProps> = ({
  line,
  itemsQuantities,
  onChangeQuantity,
  fulfillmentId,
  shouldDisplay = true
}) => {
  const { id, quantity, quantityFulfilled } = line;
  const classes = useStyles({});
  const intl = useIntl();

  const isValueError = false;
  const currentQuantity = itemsQuantities.find(getById(id))?.value;
  const lineQuantity = fulfillmentId ? quantity : quantity - quantityFulfilled;

  const handleChangeQuantity = (id: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => onChangeQuantity(id, parseInt(event.target.value, 10));

  if (!shouldDisplay) {
    return <TableCell />;
  }

  return (
    <TableCell align="right">
      <TextField
        type="number"
        inputProps={{
          className: classes.quantityInnerInput,
          "data-test": "quantityInput",
          "data-test-id": id,
          max: lineQuantity.toString(),
          min: 0,
          style: { textAlign: "right" }
        }}
        fullWidth
        value={currentQuantity}
        onChange={handleChangeQuantity(id)}
        InputProps={{
          endAdornment: lineQuantity && (
            <div className={classes.remainingQuantity}>/ {lineQuantity}</div>
          )
        }}
        error={isValueError}
        helperText={isValueError && intl.formatMessage(messages.improperValue)}
      />
    </TableCell>
  );
};

export default ProductQuantityCell;

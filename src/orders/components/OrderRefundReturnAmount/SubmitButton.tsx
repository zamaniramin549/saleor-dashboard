import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { defineMessages } from "react-intl";

import { OrderReturnFormData } from "../OrderReturnPage/form";
import OrderReturnRefundAmount from "./OrderRefundReturnAmount";
import { isItemSelected } from "./utils";
import useReturnAmountCalculator from "./utils/ReturnAmountCalculator";

const messages = defineMessages({
  cannotBeFulfilled: {
    defaultMessage: "Returned items can't be fulfilled",
    description: "order return subtitle"
  },
  submitButton: {
    defaultMessage: "Return & Replace products",
    description: "order return amount button"
  }
});

export interface SubmitButtonProps {
  //   order: OrderDetails_order;
  //   formData: OrderReturnFormData;
  //   onChange: (event: React.ChangeEvent<any>) => void;
  disabled?: boolean;
  onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit, disabled }) => {
  const { fulfilledItemsQuantities, unfulfilledItemsQuantities } = formData;
  const intl = useIntl();

  const hasAnyItemsSelected =
    fulfilledItemsQuantities.some(isItemSelected) ||
    unfulfilledItemsQuantities.some(isItemSelected);

  const disableRefundButton = isAmountTooBig || isAmountTooSmall;

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        fullWidth
        size="large"
        onClick={onSumit}
        className={classes.refundButton}
        disabled={disableRefundButton}
        data-test="submit"
      >
        {!disableRefundButton && !isReturn ? (
          <FormattedMessage
            defaultMessage="Refund {currency} {amount}"
            description="order refund amount, input button"
            values={{
              amount: Number(selectedRefundAmount).toFixed(2),
              currency: amountCurrency
            }}
          />
        ) : (
          intl.formatMessage(
            isReturn ? messages.returnButton : messages.refundButton
          )
        )}
      </Button>
      <Typography
        variant="caption"
        color="textSecondary"
        className={classes.refundCaution}
      >
        {intl.formatMessage(
          isReturn
            ? messages.returnCannotBeFulfilled
            : messages.refundCannotBeFulfilled
        )}
      </Typography>
    </>
  );
};

export default SubmitButton;

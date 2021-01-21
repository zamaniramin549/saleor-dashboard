import { Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";

import { isItemSelected } from "./utils";
import { OrderReturnRefundCommonFormData } from "./utils/types";

const useStyles = makeStyles(
  theme => ({
    helperText: {
      marginTop: theme.spacing(1)
    },
    submitButton: {
      marginTop: theme.spacing(2)
    }
  }),
  { name: "SubmitButton" }
);

export interface SubmitButtonProps {
  formData: OrderReturnRefundCommonFormData;
  disabled?: boolean;
  onSubmit: () => void;
  buttonText: string;
  helperText: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  formData,
  onSubmit,
  disabled,
  buttonText,
  helperText
}) => {
  const { fulfilledItemsQuantities, unfulfilledItemsQuantities } = formData;
  const classes = useStyles({});

  const hasAnyItemsSelected =
    fulfilledItemsQuantities.some(isItemSelected) ||
    unfulfilledItemsQuantities.some(isItemSelected);

  const isDisabled = disabled || !hasAnyItemsSelected;

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        fullWidth
        size="large"
        onClick={onSubmit}
        className={classes.submitButton}
        disabled={isDisabled}
        data-test="submit"
      >
        {buttonText}
      </Button>
      <Typography
        variant="caption"
        color="textSecondary"
        className={classes.helperText}
      >
        {helperText}
      </Typography>
    </>
  );
};

export default SubmitButton;

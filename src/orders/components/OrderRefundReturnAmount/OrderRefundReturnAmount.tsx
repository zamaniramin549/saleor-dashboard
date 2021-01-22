import { makeStyles, RadioGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Hr from "@saleor/components/Hr";
import { IMoney } from "@saleor/components/Money";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import { OrderRefundData_order } from "@saleor/orders/types/OrderRefundData";
import React from "react";
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl
} from "react-intl";

import {
  OrderRefundAmountCalculationMode,
  OrderRefundFormData,
  OrderRefundType
} from "../OrderRefundPage/form";
import { OrderReturnFormData } from "../OrderReturnPage/form";
import OrderRefundAmountValues, {
  OrderRefundAmountValuesProps
} from "./OrderRefundReturnAmountValues";
import RefundAmountInput from "./RefundAmountInput";
import SubmitButton from "./SubmitButton";
import {
  OrderReturnRefundAmountMessages,
  OrderReturnRefundCommonFormData
} from "./utils/types";

const useStyles = makeStyles(
  theme => ({
    hr: {
      margin: theme.spacing(1, 0)
    },
    maxRefundRow: {
      fontWeight: 600
    },
    priceField: {
      marginTop: theme.spacing(2)
    },
    refundButton: {
      marginTop: theme.spacing(2)
    },
    refundCaution: {
      marginTop: theme.spacing(1)
    },
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    }
  }),
  { name: "OrderRefundAmount" }
);

const messages = defineMessages({
  noRefund: {
    defaultMessage: "No refund",
    description: "no refund redio button"
  }
});

export interface OrderRefundAmountValuesProps {
  authorizedAmount: IMoney;
  maxRefundAmount: IMoney;
  previouslyRefunded: IMoney;
  shipmentCost?: IMoney;
  selectedProductsValue?: IMoney;
  proposedRefundAmount?: IMoney;
  replacedProductsValue?: IMoney;
  refundTotalAmount?: IMoney;
}

interface OrderRefundAmountProps {
  formData: OrderReturnRefundCommonFormData;
  allowNoRefund?: boolean;
  type?: OrderRefundType;
  children: React.ReactNode;
  errors: OrderErrorFragment[];
  amountData: OrderRefundAmountValuesProps;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const OrderReturnRefundAmount: React.FC<OrderRefundAmountProps> = props => {
  const {
    formData,
    order,
    type,
    errors,
    onChange,
    amountData,
    children,
    allowNoRefund = false
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const amountCurrency = order?.total?.gross?.currency;

  const {
    authorizedAmount,
    maxRefund,
    previouslyRefunded,
    proposedRefundAmount,
    refundTotalAmount,
    selectedProductsValue,
    shipmentCost,
    replacedProductsValue
  } = amountData;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Refunded Amount",
          description: "section header"
        })}
      />
      <CardContent>
        {type === OrderRefundType.PRODUCTS && (
          <RadioGroup
            value={formData.amountCalculationMode}
            onChange={onChange}
            name="amountCalculationMode"
          >
            {allowNoRefund && (
              <>
                <ControlledCheckbox
                  checked={formData.noRefund}
                  label={intl.formatMessage(messages.noRefund)}
                  name="noRefundButton"
                  onChange={onChange}
                />
                <Hr />
                <CardSpacer />
              </>
            )}
            <FormControlLabel
              disabled={disabled}
              value={OrderRefundAmountCalculationMode.AUTOMATIC}
              control={<Radio color="primary" />}
              label={intl.formatMessage({
                defaultMessage: "Automatic Amount",
                description: "label"
              })}
            />
            {data.amountCalculationMode ===
              OrderRefundAmountCalculationMode.AUTOMATIC && (
              <>
                <ControlledCheckbox
                  checked={data.refundShipmentCosts}
                  label={intl.formatMessage({
                    defaultMessage: "Refund shipment costs",
                    description: "checkbox"
                  })}
                  name="refundShipmentCosts"
                  onChange={onChange}
                />
                <CardSpacer />
                <OrderRefundAmountValues
                  authorizedAmount={authorizedAmount}
                  previouslyRefunded={previouslyRefunded}
                  maxRefund={maxRefund}
                  selectedProductsValue={selectedProductsValue}
                  refundTotalAmount={refundTotalAmount}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                  replacedProductsValue={replacedProductsValue}
                />
              </>
            )}
            <Hr className={classes.hr} />
            <FormControlLabel
              disabled={disabled}
              value={OrderRefundAmountCalculationMode.MANUAL}
              control={<Radio color="primary" />}
              label={intl.formatMessage({
                defaultMessage: "Manual Amount",
                description: "label"
              })}
            />
            {data.amountCalculationMode ===
              OrderRefundAmountCalculationMode.MANUAL && (
              <>
                <ControlledCheckbox
                  disabled={disabled}
                  checked={data.refundShipmentCosts}
                  label={intl.formatMessage({
                    defaultMessage: "Refund shipment costs",
                    description: "checkbox"
                  })}
                  name="refundShipmentCosts"
                  onChange={onChange}
                />
                <OrderRefundAmountValues
                  authorizedAmount={authorizedAmount}
                  previouslyRefunded={previouslyRefunded}
                  maxRefund={maxRefund}
                  selectedProductsValue={selectedProductsValue}
                  proposedRefundAmount={proposedRefundAmount}
                  shipmentCost={data.refundShipmentCosts && shipmentCost}
                  replacedProductsValue={replacedProductsValue}
                />
                <RefundAmountInput
                  data={data as OrderRefundFormData}
                  maxRefund={maxRefund}
                  amountTooSmall={isAmountTooSmall}
                  amountTooBig={isAmountTooBig}
                  currencySymbol={amountCurrency}
                  disabled={disabled}
                  onChange={onChange}
                  errors={errors}
                />
              </>
            )}
          </RadioGroup>
        )}
        {type === OrderRefundType.MISCELLANEOUS && (
          <>
            <OrderRefundAmountValues
              authorizedAmount={authorizedAmount}
              previouslyRefunded={previouslyRefunded}
              maxRefund={maxRefund}
            />
            <RefundAmountInput
              data={data as OrderRefundFormData}
              maxRefund={maxRefund}
              amountTooSmall={isAmountTooSmall}
              amountTooBig={isAmountTooBig}
              currencySymbol={amountCurrency}
              disabled={disabled}
              onChange={onChange}
              errors={errors}
            />
          </>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default OrderReturnRefundAmount;

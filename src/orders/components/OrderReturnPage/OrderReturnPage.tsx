import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { renderCollection } from "@saleor/misc";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import OrderAmount from "../OrderRefundReturnAmount";
import useReturnAmountCalculator from "../OrderRefundReturnAmount/utils/ReturnAmountCalculator";
import ItemsCard from "../OrderReturnItemsCard/ReturnItemsCard";
import OrderReturnForm, { OrderRefundSubmitData } from "./form";
import {
  returnFulfilledStatuses,
  ReturnRefundFulfillmentsParser
} from "./utils";

const messages = defineMessages({
  appTitle: {
    defaultMessage: "Order #{orderNumber}",
    description: "page header with order number"
  },
  pageTitle: {
    defaultMessage: "Order no. {orderNumber} - Replace/Return",
    description: "page header"
  }
});

export interface OrderReturnPageProps {
  order: OrderDetails_order;
  loading: boolean;
  errors?: OrderErrorFragment[];
  onBack: () => void;
  onSubmit: (data: OrderRefundSubmitData) => SubmitPromise;
}

const OrderRefundPage: React.FC<OrderReturnPageProps> = props => {
  const { order, loading, errors = [], onBack, onSubmit } = props;
  const fulfillmentsParser = new ReturnRefundFulfillmentsParser(
    order,
    returnFulfilledStatuses
  );

  const intl = useIntl();
  return (
    <OrderReturnForm order={order} onSubmit={onSubmit}>
      {({ data, handlers, change, submit }) => {
        const {
          fulfilledItemsQuantities,
          unfulfilledItemsQuantities,
          itemsToBeReplaced
        } = data;

        const hasAnyItemsSelected =
          fulfilledItemsQuantities.some(({ value }) => !!value) ||
          unfulfilledItemsQuantities.some(({ value }) => !!value);

        const amountCalculator = useReturnAmountCalculator(order, data);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(messages.appTitle, {
                orderNumber: order?.number
              })}
            </AppHeader>
            <PageHeader
              title={intl.formatMessage(messages.pageTitle, {
                orderNumber: order?.number
              })}
            />
            <Grid>
              <div>
                {!!unfulfilledItemsQuantities.length && (
                  <>
                    <ItemsCard
                      errors={errors}
                      order={order}
                      lines={fulfillmentsParser.getUnfulfilledLines()}
                      itemsQuantities={unfulfilledItemsQuantities}
                      itemsSelections={itemsToBeReplaced}
                      onChangeQuantity={handlers.changeUnfulfiledItemsQuantity}
                      onSetMaxQuantity={
                        handlers.handleSetMaximalUnfulfiledItemsQuantities
                      }
                      onChangeSelected={handlers.changeItemsToBeReplaced}
                    />
                    <CardSpacer />
                  </>
                )}
                {renderCollection(
                  fulfillmentsParser.getFulfilledFulfillemnts(),
                  ({ id, ...rest }) => (
                    <React.Fragment key={id}>
                      <ItemsCard
                        errors={errors}
                        order={order}
                        fulfilmentId={id}
                        lines={ReturnRefundFulfillmentsParser.getParsedLinesOfFulfillment(
                          { id, ...rest }
                        )}
                        itemsQuantities={data.fulfilledItemsQuantities}
                        itemsSelections={data.itemsToBeReplaced}
                        onChangeQuantity={handlers.changeFulfiledItemsQuantity}
                        onSetMaxQuantity={handlers.handleSetMaximalFulfiledItemsQuantities(
                          id
                        )}
                        onChangeSelected={handlers.changeItemsToBeReplaced}
                      />
                      <CardSpacer />
                    </React.Fragment>
                  )
                )}
              </div>
              <div>
                <OrderAmount
                  isReturn
                  amountData={amountCalculator.getCalculatedValues()}
                  data={data}
                  order={order}
                  disableSubmitButton={!hasAnyItemsSelected}
                  disabled={loading}
                  errors={errors}
                  onChange={change}
                  onRefund={submit}
                />
              </div>
            </Grid>
          </Container>
        );
      }}
    </OrderReturnForm>
  );
};

export default OrderRefundPage;

import PageTitleWithStatusChip from "@saleor/components/PageTitleWithStatusChip";
import StatusChip from "@saleor/components/StatusChip";
import { transformOrderStatus } from "@saleor/misc";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { useIntl } from "react-intl";

interface TitleProps {
  order?: OrderDetails_order;
}

const OrderStatusChip: React.FC<TitleProps> = ({ order }) => {
  const intl = useIntl();

  if (!order) {
    return null;
  }

  const { localized, status } = transformOrderStatus(order.status, intl);

  return (
    <StatusChip
      title={order?.number}
      statusLabel={localized}
      statusType={status}
    />
  );
};

export default OrderStatusChip;

const CustomerGiftCardList: React.FC<CustomerGiftCardList> = ({
  giftCards,
  loading
}) => (
  <Skeleton>
    {!loading &&
      giftCards.map(giftCard => (
        <CustomerGiftCardListItem giftCard={getExtendedGiftCard(giftCard)} />
      ))}
  </Skeleton>
);

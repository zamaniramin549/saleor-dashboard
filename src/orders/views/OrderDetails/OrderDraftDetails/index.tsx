import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import { OrderDiscountProvider } from "@saleor/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@saleor/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { useCountAllProducts } from "@saleor/products/queries";
import useCustomerSearch from "@saleor/searches/useCustomerSearch";
import commonErrorMessages from "@saleor/utils/errors/common";
import React from "react";
import { defineMessages, IntlShape, useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import { getStringOrPlaceholder } from "../../../../misc";
import { productUrl } from "../../../../products/urls";
import OrderDraftCancelDialog from "../../../components/OrderDraftCancelDialog/OrderDraftCancelDialog";
import OrderDraftPage from "../../../components/OrderDraftPage";
import OrderProductAddDialog from "../../../components/OrderProductAddDialog";
import OrderShippingMethodEditDialog from "../../../components/OrderShippingMethodEditDialog";
import { useOrderVariantSearch } from "../../../queries";
import { OrderUrlQueryParams } from "../../../urls";
import { orderDraftListUrl } from "../../../urls";

export enum OrderDraftErrorCode {
  CHANNEL_NOT_ACTIVE = "CHANNEL_NOT_ACTIVE",
  CHANNEL_HAS_NO_PRODUCTS = "CHANNEL_HAS_NO_PRODUCTS",
  CHANNEL_HAS_NO_SHIPPING_METHODS = "CHANNEL_HAS_NO_SHIPPING_METHODS"
}

export interface OrderDraftErrorTypes {
  code: OrderDraftErrorCode;
}

const orderDraftErrorTitleMessages = defineMessages({
  channelNotActive: {
    defaultMessage: "Selected channel is inactive",
    description: "error title"
  },
  channelHasNoProducts: {
    defaultMessage: "Selected channel has no products available",
    description: "error title"
  },
  channelHasNoShippingMethods: {
    defaultMessage: "Selected channel has no shipping methods",
    description: "error title"
  }
});
const orderDraftErrorDescriptionMessages = defineMessages({
  channelNotActive: {
    defaultMessage: `Selected channel is inactive, so you won’t be able to finalize the draft`,
    description: "error description"
  },
  channelHasNoProducts: {
    defaultMessage: `There are no products to sell in this channel. You won’t be able to add any to this draft.
    To change that you need to make products you want to sell available.`,
    description: "error description"
  },
  channelHasNoShippingMethods: {
    defaultMessage: `There are no products to sell in this channel. You won’t be able to add any to this draft.
    To change that you need to make products you want to sell available.`,
    description: "error description"
  }
});

export function getOrderDraftErrorTitle(
  err: OrderDraftErrorTypes | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case OrderDraftErrorCode.CHANNEL_NOT_ACTIVE:
        return intl.formatMessage(
          orderDraftErrorTitleMessages.channelNotActive
        );
      case OrderDraftErrorCode.CHANNEL_HAS_NO_PRODUCTS:
        return intl.formatMessage(
          orderDraftErrorTitleMessages.channelHasNoProducts
        );
      case OrderDraftErrorCode.CHANNEL_HAS_NO_SHIPPING_METHODS:
        return intl.formatMessage(
          orderDraftErrorTitleMessages.channelHasNoShippingMethods
        );
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }
  return undefined;
}
export function getOrderDraftErrorDescription(
  err: OrderDraftErrorTypes | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case OrderDraftErrorCode.CHANNEL_NOT_ACTIVE:
        return intl.formatMessage(
          orderDraftErrorDescriptionMessages.channelNotActive
        );
      case OrderDraftErrorCode.CHANNEL_HAS_NO_PRODUCTS:
        return intl.formatMessage(
          orderDraftErrorDescriptionMessages.channelHasNoProducts
        );
      case OrderDraftErrorCode.CHANNEL_HAS_NO_SHIPPING_METHODS:
        return intl.formatMessage(
          orderDraftErrorDescriptionMessages.channelHasNoShippingMethods
        );
      default:
        return undefined;
    }
  }
  return undefined;
}

interface OrderDraftDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  loading: any;
  data: any;
  orderAddNote: any;
  orderLineUpdate: any;
  orderLineDelete: any;
  orderShippingMethodUpdate: any;
  orderLinesAdd: any;
  orderDraftUpdate: any;
  orderDraftCancel: any;
  orderDraftFinalize: any;
  openModal: any;
  closeModal: any;
}

export const OrderDraftDetails: React.FC<OrderDraftDetailsProps> = ({
  id,
  params,
  loading,
  data,
  orderAddNote,
  orderLineUpdate,
  orderLineDelete,
  orderShippingMethodUpdate,
  orderLinesAdd,
  orderDraftUpdate,
  orderDraftCancel,
  orderDraftFinalize,
  openModal,
  closeModal
}) => {
  const order = data.order;
  const navigate = useNavigator();
  const { user } = useUser();
  const { channel } = useAppChannel();
  const countChannelProducts = useCountAllProducts({
    variables: {
      filter: {
        channel: channel.id
      }
    }
  });
  console.log(channel, countChannelProducts);
  const getGlobalErrors = () => {
    let errors: OrderDraftErrorTypes[] = [];

    if (!channel.isActive) {
      errors = [
        ...errors,
        {
          code: OrderDraftErrorCode.CHANNEL_NOT_ACTIVE
        }
      ];
    }
    if (!order.availableShippingMethods.length) {
      errors = [
        ...errors,
        {
          code: OrderDraftErrorCode.CHANNEL_HAS_NO_SHIPPING_METHODS
        }
      ];
    }
    if (
      !countChannelProducts.loading &&
      !countChannelProducts.data.products.totalCount
    ) {
      errors = [
        ...errors,
        {
          code: OrderDraftErrorCode.CHANNEL_HAS_NO_PRODUCTS
        }
      ];
    }

    return errors;
  };
  console.log(getGlobalErrors());

  const {
    loadMore,
    search: variantSearch,
    result: variantSearchOpts
  } = useOrderVariantSearch({
    variables: { ...DEFAULT_INITIAL_SEARCH_DATA, channel: order.channel.slug }
  });

  const {
    loadMore: loadMoreCustomers,
    search: searchUsers,
    result: users
  } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const intl = useIntl();

  return (
    <>
      <WindowTitle
        title={intl.formatMessage(
          {
            defaultMessage: "Draft Order #{orderNumber}",
            description: "window title"
          },
          {
            orderNumber: getStringOrPlaceholder(data?.order?.number)
          }
        )}
      />

      <OrderDiscountProvider order={order}>
        <OrderLineDiscountProvider order={order}>
          <OrderDraftPage
            disabled={loading}
            globalErrors={getGlobalErrors()}
            onNoteAdd={variables =>
              orderAddNote.mutate({
                input: variables,
                order: id
              })
            }
            users={users?.data?.search?.edges?.map(edge => edge.node) || []}
            hasMore={users?.data?.search?.pageInfo?.hasNextPage || false}
            onFetchMore={loadMoreCustomers}
            fetchUsers={searchUsers}
            loading={users.loading}
            usersLoading={users.loading}
            onCustomerEdit={data =>
              orderDraftUpdate.mutate({
                id,
                input: data
              })
            }
            onDraftFinalize={() => orderDraftFinalize.mutate({ id })}
            onDraftRemove={() => openModal("cancel")}
            onOrderLineAdd={() => openModal("add-order-line")}
            onBack={() => navigate(orderDraftListUrl())}
            order={order}
            countries={(data?.shop?.countries || []).map(country => ({
              code: country.code,
              label: country.country
            }))}
            onProductClick={id => () =>
              navigate(productUrl(encodeURIComponent(id)))}
            onBillingAddressEdit={() => openModal("edit-billing-address")}
            onShippingAddressEdit={() => openModal("edit-shipping-address")}
            onShippingMethodEdit={() => openModal("edit-shipping")}
            onOrderLineRemove={id => orderLineDelete.mutate({ id })}
            onOrderLineChange={(id, data) =>
              orderLineUpdate.mutate({
                id,
                input: data
              })
            }
            saveButtonBarState="default"
            onProfileView={() => navigate(customerUrl(order.user.id))}
            userPermissions={user?.userPermissions || []}
          />
        </OrderLineDiscountProvider>
      </OrderDiscountProvider>
      <OrderDraftCancelDialog
        confirmButtonState={orderDraftCancel.opts.status}
        errors={orderDraftCancel.opts.data?.draftOrderDelete.errors || []}
        onClose={closeModal}
        onConfirm={() => orderDraftCancel.mutate({ id })}
        open={params.action === "cancel"}
        orderNumber={getStringOrPlaceholder(order?.number)}
      />
      <OrderShippingMethodEditDialog
        confirmButtonState={orderShippingMethodUpdate.opts.status}
        errors={
          orderShippingMethodUpdate.opts.data?.orderUpdateShipping.errors || []
        }
        open={params.action === "edit-shipping"}
        shippingMethod={order?.shippingMethod?.id}
        shippingMethods={order?.availableShippingMethods}
        onClose={closeModal}
        onSubmit={variables =>
          orderShippingMethodUpdate.mutate({
            id,
            input: {
              shippingMethod: variables.shippingMethod
            }
          })
        }
      />
      <OrderProductAddDialog
        confirmButtonState={orderLinesAdd.opts.status}
        errors={orderLinesAdd.opts.data?.orderLinesCreate.errors || []}
        loading={variantSearchOpts.loading}
        open={params.action === "add-order-line"}
        hasMore={variantSearchOpts.data?.search.pageInfo.hasNextPage}
        products={variantSearchOpts.data?.search.edges.map(edge => edge.node)}
        selectedChannelId={order?.channel?.id}
        onClose={closeModal}
        onFetch={variantSearch}
        onFetchMore={loadMore}
        onSubmit={variants =>
          orderLinesAdd.mutate({
            id,
            input: variants.map(variant => ({
              quantity: 1,
              variantId: variant.id
            }))
          })
        }
      />
    </>
  );
};

export default OrderDraftDetails;

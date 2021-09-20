import { SearchCustomers_search_edges_node } from "@saleor/searches/types/SearchCustomers";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter
} from "@saleor/utils/filters";
import { mapSingleValueNodeToChoice } from "@saleor/utils/maps";

import { GiftCardListUrlQueryParams } from "../types";
import {
  GiftCardListFilterOpts,
  GiftCardListUrlFilters,
  GiftCardListUrlFiltersEnum,
  SearchWithFetchMoreProps
} from "./types";

export const GIFT_CARD_FILTERS_KEY = "giftCardFilters";

interface GiftCardFilterOptsProps {
  params: GiftCardListUrlFilters;
  currencies: string[];
  currencySearchProps: SearchWithFetchMoreProps;
  products: SearchProducts_search_edges_node[];
  productSearchProps: SearchWithFetchMoreProps;
  customers: SearchCustomers_search_edges_node[];
  customerSearchProps: SearchWithFetchMoreProps;
  balanceCurrencies: string[];
  balanceCurrencySearchProps: SearchWithFetchMoreProps;
  tags: string[];
  tagSearchProps: SearchWithFetchMoreProps;
}

export const getFilterOpts = ({
  params,
  currencies,
  currencySearchProps,
  products,
  productSearchProps,
  customers,
  customerSearchProps,
  balanceCurrencies,
  balanceCurrencySearchProps,
  tags,
  tagSearchProps
}: GiftCardFilterOptsProps): GiftCardListFilterOpts => ({
  currency: {
    active: !!params?.currency,
    value: params?.currency,
    choices: mapSingleValueNodeToChoice(currencies),
    displayValues: mapSingleValueNodeToChoice(currencies),
    initialSearch: "",
    hasMore: currencySearchProps.hasMore,
    loading: currencySearchProps.loading,
    onFetchMore: currencySearchProps.onFetchMore,
    onSearchChange: currencySearchProps.onSearchChange
  },
  product: {
    active: !!params?.product,
    value: params?.product,
    choices: mapSingleValueNodeToChoice(products),
    displayValues: mapSingleValueNodeToChoice(products),
    initialSearch: "",
    hasMore: productSearchProps.hasMore,
    loading: productSearchProps.loading,
    onFetchMore: productSearchProps.onFetchMore,
    onSearchChange: productSearchProps.onSearchChange
  },
  usedBy: {
    active: !!params?.usedBy,
    value: params?.usedBy,
    choices: mapSingleValueNodeToChoice(customers),
    displayValues: mapSingleValueNodeToChoice(customers),
    initialSearch: "",
    hasMore: customerSearchProps.hasMore,
    loading: customerSearchProps.loading,
    onFetchMore: customerSearchProps.onFetchMore,
    onSearchChange: customerSearchProps.onSearchChange
  },
  balanceCurrency: {
    active: !!params?.balanceCurrency,
    value: params?.balanceCurrency,
    choices: mapSingleValueNodeToChoice(balanceCurrencies),
    displayValues: mapSingleValueNodeToChoice(balanceCurrencies),
    initialSearch: "",
    hasMore: balanceCurrencySearchProps.hasMore,
    loading: balanceCurrencySearchProps.loading,
    onFetchMore: balanceCurrencySearchProps.onFetchMore,
    onSearchChange: balanceCurrencySearchProps.onSearchChange
  },
  tags: {
    active: !!params?.tags,
    value: dedupeFilter(params?.tags || []),
    choices: mapSingleValueNodeToChoice(tags),
    displayValues: mapSingleValueNodeToChoice(tags),
    initialSearch: "",
    hasMore: tagSearchProps.hasMore,
    loading: tagSearchProps.loading,
    onFetchMore: tagSearchProps.onFetchMore,
    onSearchChange: tagSearchProps.onSearchChange
  },
  balanceAmount: {
    active: !!params?.balanceAmount,
    value: parseInt(params?.balanceAmount, 10)
  }
});

// export function getFilterVariables(
//   params: CollectionListUrlFilters
// ): CollectionFilterInput {
//   return {
//     published: params.status
//       ? findValueInEnum(params.status, CollectionPublished)
//       : undefined,
//     search: params.query
//   };
// }

// export function getFilterQueryParam(
//   filter: IFilterElement<CollectionFilterKeys>
// ): CollectionListUrlFilters {
//   const { name } = filter;

//   switch (name) {
//     case CollectionFilterKeys.status:
//       return getSingleEnumValueQueryParam(
//         filter,
//         CollectionListUrlFiltersEnum.status,
//         CollectionPublished
//       );
//     case CollectionFilterKeys.channel:
//       return getSingleValueQueryParam(
//         filter,
//         CollectionListUrlFiltersEnum.channel
//       );
//   }
// }

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<GiftCardListUrlFilters>(GIFT_CARD_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab
} = createFilterUtils<GiftCardListUrlQueryParams, GiftCardListUrlFilters>(
  GiftCardListUrlFiltersEnum
);

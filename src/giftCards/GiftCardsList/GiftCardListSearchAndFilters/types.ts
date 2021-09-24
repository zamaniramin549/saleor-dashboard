import {
  AutocompleteFilterOpts,
  FetchMoreProps,
  FilterOpts,
  Filters,
  FiltersWithMultipleValues,
  Search,
  SearchProps
} from "@saleor/types";

export enum GiftCardListUrlFiltersEnum {
  currency = "currency",
  balanceCurrency = "balanceCurrency",
  balanceAmount = "balanceAmount",
  status = "status"
}

export enum GiftCardListUrlFiltersWithMultipleValuesEnum {
  tag = "tag",
  product = "product",
  usedBy = "usedBy"
}

export enum GiftCardListFilterKeys {
  currency = "currency",
  balance = "balance",
  balanceCurrency = "balanceCurrency",
  balanceAmount = "balanceAmount",
  tag = "tag",
  product = "product",
  usedBy = "usedBy",
  status = "status"
}

export type GiftCardListUrlFilters = Filters<GiftCardListUrlFiltersEnum> &
  FiltersWithMultipleValues<GiftCardListUrlFiltersWithMultipleValuesEnum>;

export interface GiftCardListFilterOpts {
  tag: FilterOpts<string[]> & AutocompleteFilterOpts;
  currency: FilterOpts<string> & AutocompleteFilterOpts;
  product: FilterOpts<string> & AutocompleteFilterOpts;
  usedBy: FilterOpts<string> & AutocompleteFilterOpts;
  balanceCurrency: FilterOpts<string> & AutocompleteFilterOpts;
  balanceAmount: FilterOpts<string>;
  status: FilterOpts<string>;
}

export type SearchWithFetchMoreProps = FetchMoreProps & Search & SearchProps;

export enum GiftCardStatusFilterEnum {
  enabled = "enabled",
  disabled = "disabled"
}

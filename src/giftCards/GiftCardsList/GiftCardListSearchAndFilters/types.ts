import {
  AutocompleteFilterOpts,
  FetchMoreProps,
  FilterOpts,
  Filters,
  Search,
  SearchProps
} from "@saleor/types";

export enum GiftCardListUrlFiltersEnum {
  currency = "currency",
  balanceCurrency = "balanceCurrency",
  balanceAmount = "balanceAmount",
  tags = "tags",
  product = "product",
  usedBy = "usedBy"
}

export type GiftCardListUrlFilters = Filters<GiftCardListUrlFiltersEnum>;

export interface GiftCardListFilterOpts {
  tags: FilterOpts<string[]> & AutocompleteFilterOpts;
  currency: FilterOpts<string> & AutocompleteFilterOpts;
  product: FilterOpts<string> & AutocompleteFilterOpts;
  usedBy: FilterOpts<string> & AutocompleteFilterOpts;
  balanceCurrency: FilterOpts<string> & AutocompleteFilterOpts;
  balanceAmount: FilterOpts<number>;
}

export type SearchWithFetchMoreProps<T extends {}> = FetchMoreProps &
  Search &
  SearchProps &
  T;

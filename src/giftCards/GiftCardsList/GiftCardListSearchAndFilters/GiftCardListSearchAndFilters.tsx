import FilterBar from "@saleor/components/FilterBar";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useGiftCardTagsSearch from "@saleor/giftCards/components/GiftCardTagInput/useGiftCardTagsSearch";
import { getSearchFetchMoreProps } from "@saleor/hooks/makeTopLevelSearch/utils";
import useCustomerSearch from "@saleor/searches/useCustomerSearch";
import useProductSearch from "@saleor/searches/useProductSearch";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

import useGiftCardList from "../providers/GiftCardListProvider/hooks/useGiftCardList";
import { getFilterOpts, getFiltersCurrentTab, getFilterTabs } from "./filters";
import { useGiftCardCurrencySearch } from "./queries";

const GiftCardListSearchAndFilters: React.FC = ({}) => {
  const { params } = useGiftCardList();

  const defaultSearchVariables = {
    variables: DEFAULT_INITIAL_SEARCH_DATA
  };

  const {
    loadMore: fetchMoreCustomers,
    search: searchCustomers,
    result: searchCustomersResult
  } = useCustomerSearch(defaultSearchVariables);

  const {
    loadMore: fetchMoreProducts,
    search: searchProducts,
    result: searchProductsResult
  } = useProductSearch(defaultSearchVariables);

  const {
    loadMore: fetchMoreCurrencies,
    search: searchCurrencies,
    result: searchCurrenciesResult
  } = useGiftCardCurrencySearch({});

  const {
    loadMore: fetchMoreBalanceCurrencies,
    search: searchBalanceCurrencies,
    result: searchBalanceCurrenciesResult
  } = useGiftCardCurrencySearch({});

  const {
    loadMore: fetchMoreGiftCardTags,
    search: searchGiftCardTags,
    result: searchGiftCardTagsResult
  } = useGiftCardTagsSearch({});

  const filterOpts = getFilterOpts({
    params,
    productSearchProps: {
      ...getSearchFetchMoreProps(searchProductsResult, fetchMoreProducts),
      onSearchChange: searchProducts
    },
    products: mapEdgesToItems(searchProductsResult?.data?.search),
    currencySearchProps: {
      ...getSearchFetchMoreProps(searchCurrenciesResult, fetchMoreCurrencies),
      onSearchChange: searchCurrencies
    },
    currencies: mapEdgesToItems(searchCurrenciesResult?.data?.search).map(
      ({ currentBalance }) => currentBalance.currency
    ),
    customerSearchProps: {
      ...getSearchFetchMoreProps(searchCustomersResult, fetchMoreCustomers),
      onSearchChange: searchCustomers
    },
    customers: mapEdgesToItems(searchCustomersResult?.data?.search),
    balanceCurrencySearchProps: {
      ...getSearchFetchMoreProps(
        searchBalanceCurrenciesResult,
        fetchMoreBalanceCurrencies
      ),
      onSearchChange: searchBalanceCurrencies
    },
    balanceCurrencies: mapEdgesToItems(
      searchBalanceCurrenciesResult?.data?.search
    ).map(({ currentBalance }) => currentBalance.currency),
    tagSearchProps: {
      ...getSearchFetchMoreProps(
        searchGiftCardTagsResult,
        fetchMoreGiftCardTags
      ),
      onSearchChange: searchGiftCardTags
    },
    tags: mapEdgesToItems(searchGiftCardTagsResult?.data?.search).map(
      ({ tag }) => tag
    )
  });

  const tabs = getFilterTabs();
  const currentTab = getFiltersCurrentTab(params, tabs);

  // const queryVariables = React.useMemo(
  //   () => ({
  //     filter: getFilterVariables(params),
  //     sort: getSortQueryVariables(params)
  //   }),
  //   [params]
  // );

  // const [
  //   changeFilters,
  //   resetFilters,
  //   handleSearchChange
  // ] = createFilterHandlers({
  //   createUrl: pluginListUrl,
  //   getFilterQueryParam,
  //   navigate,
  //   params
  // });

  return (
    <FilterBar
      allTabLabel={intl.formatMessage({
        defaultMessage: "All Collections",
        description: "tab name"
      })}
      currentTab={currentTab}
      filterStructure={filterStructure}
      initialSearch={initialSearch}
      onAll={onAll}
      onFilterChange={onFilterChange}
      onFilterAttributeFocus={onFilterAttributeFocus}
      onSearchChange={onSearchChange}
      onTabChange={onTabChange}
      onTabDelete={onTabDelete}
      onTabSave={onTabSave}
      searchPlaceholder={intl.formatMessage({
        defaultMessage: "Search Collections"
      })}
      tabs={tabs}
    />
  );
};

export default GiftCardListSearchAndFilters;

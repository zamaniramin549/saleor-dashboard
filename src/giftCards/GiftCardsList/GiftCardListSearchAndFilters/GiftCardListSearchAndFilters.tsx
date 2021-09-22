import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import FilterBar from "@saleor/components/FilterBar";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useGiftCardTagsSearch from "@saleor/giftCards/components/GiftCardTagInput/useGiftCardTagsSearch";
import { giftCardListUrl } from "@saleor/giftCards/urls";
import { getSearchFetchMoreProps } from "@saleor/hooks/makeTopLevelSearch/utils";
import useNavigator from "@saleor/hooks/useNavigator";
import { maybe } from "@saleor/misc";
import useCustomerSearch from "@saleor/searches/useCustomerSearch";
import useProductSearch from "@saleor/searches/useProductSearch";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import compact from "lodash/compact";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardListDialogs from "../providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardList from "../providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "../providers/hooks/useGiftCardListBulkActions";
import { GiftCardListActionParamsEnum } from "../types";
import {
  createFilterStructure,
  deleteFilterTab,
  getActiveFilters,
  getFilterOpts,
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  saveFilterTab
} from "./filters";
import { useGiftCardCurrencySearch } from "./queries";

const GiftCardListSearchAndFilters: React.FC = ({ reset }) => {
  const navigate = useNavigator();
  const intl = useIntl();

  const { params } = useGiftCardList();
  // const { reset } = useGiftCardListBulkActions();

  const {
    closeDialog,
    openSearchDeleteDialog,
    openSearchSaveDialog
  } = useGiftCardListDialogs();

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
  } = useGiftCardCurrencySearch(defaultSearchVariables);

  const {
    loadMore: fetchMoreBalanceCurrencies,
    search: searchBalanceCurrencies,
    result: searchBalanceCurrenciesResult
  } = useGiftCardCurrencySearch(defaultSearchVariables);

  const {
    loadMore: fetchMoreGiftCardTags,
    search: searchGiftCardTags,
    result: searchGiftCardTagsResult
  } = useGiftCardTagsSearch(defaultSearchVariables);

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
    currencies: mapEdgesToItems(searchCurrenciesResult?.data?.search)?.map(
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
    )?.map(({ currentBalance }) => currentBalance.currency),
    tagSearchProps: {
      ...getSearchFetchMoreProps(
        searchGiftCardTagsResult,
        fetchMoreGiftCardTags
      ),
      onSearchChange: searchGiftCardTags
    },
    tags: compact(
      mapEdgesToItems(searchGiftCardTagsResult?.data?.search)?.map(
        ({ tag }) => tag
      )
    )
  });

  const filterStructure = createFilterStructure(intl, filterOpts);
  console.log(filterStructure);

  const tabs = getFilterTabs();
  const currentTab = getFiltersCurrentTab(params, tabs);

  // const queryVariables = React.useMemo(
  //   () => ({
  //     filter: getFilterVariables(params),
  //     sort: getSortQueryVariables(params)
  //   }),
  //   [params]
  // );

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    createUrl: giftCardListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      giftCardListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(giftCardListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  return (
    <>
      <FilterBar
        tabs={tabs.map(tab => tab.name)}
        currentTab={currentTab}
        filterStructure={filterStructure}
        initialSearch={params?.query || ""}
        onAll={resetFilters}
        onFilterChange={changeFilters}
        onSearchChange={handleSearchChange}
        onTabChange={handleTabChange}
        onTabDelete={openSearchDeleteDialog}
        onTabSave={openSearchSaveDialog}
        searchPlaceholder={intl.formatMessage({
          defaultMessage: "Search Collections"
        })}
        allTabLabel={intl.formatMessage({
          defaultMessage: "All Collections",
          description: "tab name"
        })}
      />
      <SaveFilterTabDialog
        open={params.action === GiftCardListActionParamsEnum.SAVE_SEARCH}
        confirmButtonState="default"
        onClose={closeDialog}
        onSubmit={handleTabSave}
      />
      <DeleteFilterTabDialog
        open={params.action === GiftCardListActionParamsEnum.DELETE_SEARCH}
        confirmButtonState="default"
        onClose={closeDialog}
        onSubmit={handleTabDelete}
        tabName={maybe(() => tabs[currentTab - 1].name, "...")}
      />
    </>
  );
};

export default GiftCardListSearchAndFilters;

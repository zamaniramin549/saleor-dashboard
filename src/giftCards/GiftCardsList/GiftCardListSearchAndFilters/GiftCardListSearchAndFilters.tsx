import FilterBar from "@saleor/components/FilterBar";
import React from "react";
import { getFiltersCurrentTab, getFilterTabs } from "./filters";

interface GiftCardListSearchAndFiltersProps {}

const GiftCardListSearchAndFilters: React.FC<GiftCardListSearchAndFiltersProps> = ({}) => {
  const filterOpts = getFilterOpts(params, channelOpts);
  const tabs = getFilterTabs();
  const currentTab = getFiltersCurrentTab(params, tabs);

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

import Card from "@material-ui/core/Card";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import { FilterErrors, IFilter } from "@saleor/components/Filter";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { PluginListUrlSortField } from "@saleor/plugins/urls";
import {
  FilterPageProps,
  PageListProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import compact from "lodash-es/compact";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { Plugins_plugins_edges_node } from "../../types/Plugins";
import PluginsList from "../PluginsList/PluginsList";
import {
  createFilterStructure,
  PluginFilterKeys,
  PluginListFilterOpts
} from "./filters";
import { getByName } from "./utils";

export interface PluginsListPageProps
  extends PageListProps,
    FilterPageProps<PluginFilterKeys, PluginListFilterOpts>,
    SortPage<PluginListUrlSortField>,
    TabPageProps {
  plugins: Plugins_plugins_edges_node[];
  onBack: () => void;
}

const PluginsListPage: React.FC<PluginsListPageProps> = ({
  currentTab,
  initialSearch,
  filterOpts,
  tabs,
  onAdd,
  onAll,
  onBack,
  onSearchChange,
  onFilterChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  ...listProps
}) => {
  const intl = useIntl();

  const [filterErrors, setFilterErrors] = useState<
    FilterErrors<PluginFilterKeys>
  >({});
  const filterStructure = createFilterStructure(intl, filterOpts);

  const handleFiltersChange = (filtersData: IFilter<PluginFilterKeys>) => {
    const statusField = filtersData.find(getByName(PluginFilterKeys.status));
    const channelsField = statusField.multipleFields.find(
      getByName(PluginFilterKeys.channels)
    );

    if (
      !statusField.active ||
      (statusField.active && !!compact(channelsField.value).length)
    ) {
      onFilterChange(filtersData);
      return;
    }

    setFilterErrors({
      [PluginFilterKeys.active]: {
        isError: true,
        message: intl.formatMessage({
          defaultMessage: "No channels selected"
        })
      }
    });
  };

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.plugins)} />
      <Card>
        <FilterBar
          errors={filterErrors}
          currentTab={currentTab}
          initialSearch={initialSearch}
          onAll={onAll}
          onFilterChange={handleFiltersChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
          tabs={tabs}
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Plugins",
            description: "tab name"
          })}
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Plugins..."
          })}
        />
        <PluginsList {...listProps} />
      </Card>
    </Container>
  );
};
PluginsListPage.displayName = "PluginsListPage";
export default PluginsListPage;

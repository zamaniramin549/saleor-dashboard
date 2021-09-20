import Container from "@saleor/components/Container";
import React from "react";

import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListTable from "./GiftCardsListTable";

const GiftCardsListPage: React.FC = () => (
  <Container>
    <GiftCardsListHeader />
    <GiftCardListSearchAndFilters />
    <GiftCardsListTable />
  </Container>
);

export default GiftCardsListPage;

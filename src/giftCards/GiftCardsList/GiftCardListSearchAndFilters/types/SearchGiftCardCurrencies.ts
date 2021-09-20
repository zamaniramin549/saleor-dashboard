/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchGiftCardCurrencies
// ====================================================

export interface SearchGiftCardCurrencies_search_edges_node_currentBalance {
  __typename: "Money";
  currency: string;
}

export interface SearchGiftCardCurrencies_search_edges_node {
  __typename: "GiftCard";
  currentBalance: SearchGiftCardCurrencies_search_edges_node_currentBalance | null;
}

export interface SearchGiftCardCurrencies_search_edges {
  __typename: "GiftCardCountableEdge";
  node: SearchGiftCardCurrencies_search_edges_node;
}

export interface SearchGiftCardCurrencies_search_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface SearchGiftCardCurrencies_search {
  __typename: "GiftCardCountableConnection";
  totalCount: number | null;
  edges: SearchGiftCardCurrencies_search_edges[];
  pageInfo: SearchGiftCardCurrencies_search_pageInfo;
}

export interface SearchGiftCardCurrencies {
  search: SearchGiftCardCurrencies_search | null;
}

export interface SearchGiftCardCurrenciesVariables {
  query: string;
  first: number;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}

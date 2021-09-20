import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchGiftCardCurrencies,
  SearchGiftCardCurrenciesVariables
} from "./types/SearchGiftCardCurrencies";

const searchGiftCardCurrencies = gql`
  ${pageInfoFragment}
  query SearchGiftCardCurrencies(
    $query: String!
    $first: Int!
    $after: String
    $last: Int
    $before: String
  ) {
    search: giftCards(
      filter: { currency: $query }
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
      totalCount
      edges {
        node {
          currentBalance {
            currency
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const useGiftCardCurrencySearch = makeTopLevelSearch<
  SearchGiftCardCurrencies,
  SearchGiftCardCurrenciesVariables
>(searchGiftCardCurrencies);

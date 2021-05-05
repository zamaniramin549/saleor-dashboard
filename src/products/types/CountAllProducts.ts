/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductFilterInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: CountAllProducts
// ====================================================

export interface CountAllProducts_products {
  __typename: "ProductCountableConnection";
  totalCount: number | null;
}

export interface CountAllProducts {
  products: CountAllProducts_products | null;
}

export interface CountAllProductsVariables {
  filter?: ProductFilterInput | null;
}

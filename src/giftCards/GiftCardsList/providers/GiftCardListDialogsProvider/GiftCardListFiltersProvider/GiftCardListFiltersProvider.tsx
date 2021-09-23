import React, { createContext } from "react";

interface GiftCardListFiltersProviderProps {
  children: React.ReactNode;
}

interface GiftCardListFiltersConsumerProps {}

export const GiftCardListFiltersContext = createContext<
  GiftCardListFiltersConsumerProps
>(null);

export const GiftCardListFiltersProvider: React.FC<GiftCardListFiltersProviderProps> = ({
  children
}) => {
  const providerValues: GiftCardListFiltersConsumerProps = {};

  const { updateListSettings, settings } = useListSettings<
    GiftCardListColummns
  >(ListViews.GIFT_CARD_LIST);

  const paginationState = createPaginationState(settings.rowNumber, params);

  const queryVariables = React.useMemo<GiftCardListVariables>(
    () => ({
      ...paginationState
    }),
    [params]
  );

  return (
    <GiftCardListFiltersContext.Provider value={providerValues}>
      {children}
    </GiftCardListFiltersContext.Provider>
  );
};

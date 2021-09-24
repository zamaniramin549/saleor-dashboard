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

  return (
    <GiftCardListFiltersContext.Provider value={providerValues}>
      {children}
    </GiftCardListFiltersContext.Provider>
  );
};

import { IMoney } from "@saleor/components/Money";
import { FormsetAtomicData } from "@saleor/hooks/useFormset";

export const isAmountToSmall = (amount: IMoney) => amount.amount <= 0;

// export const isAmountTooBig
export const isItemSelected = ({ value }: FormsetAtomicData) => !!value;

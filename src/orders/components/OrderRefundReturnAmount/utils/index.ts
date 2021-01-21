import { IMoney } from "@saleor/components/Money";
import { FormsetAtomicData } from "@saleor/hooks/useFormset";

import { OrderRefundFormData } from "../../OrderRefundPage/form";
import { OrderReturnFormData } from "../../OrderReturnPage/form";

export const isProperManualAmount = (
  amountValues: { maxRefundAmount: IMoney },
  formData: OrderReturnFormData | OrderRefundFormData
) =>
  !isAmountTooSmall(formData.manualAmount) &&
  !isAmountTooBig(formData, amountValues);

export const isAmountTooSmall = (amount: number) => amount <= 0;

export const isAmountTooBig = (
  formData: OrderReturnFormData | OrderRefundFormData,
  { maxRefundAmount }: { maxRefundAmount: IMoney }
) => formData.manualAmount > maxRefundAmount.amount;

export const isItemSelected = ({ value }: FormsetAtomicData) => !!value;

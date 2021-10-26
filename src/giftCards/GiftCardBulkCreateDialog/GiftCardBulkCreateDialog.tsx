import { Dialog, DialogTitle } from "@material-ui/core";
import { IMessage } from "@saleor/components/messages";
import useCurrentDate from "@saleor/hooks/useCurrentDate";
import useNotifier from "@saleor/hooks/useNotifier";
import { DialogProps } from "@saleor/types";
import { GiftCardBulkCreateInput } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import commonErrorMessages from "@saleor/utils/errors/common";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import GiftCardCreateSuccessDialog from "../GiftCardCreateDialog/GiftCardCreateSuccessDialog";
import { useChannelCurrencies } from "../GiftCardCreateDialog/queries";
import { getGiftCardExpiryInputData } from "../GiftCardCreateDialog/utils";
import { GIFT_CARD_LIST_QUERY } from "../GiftCardsList/types";
import GiftCardBulkCreateDialogForm from "./GiftCardBulkCreateDialogForm";
import { giftCardBulkCreateDialogMessages as messages } from "./messages";
import { useGiftCardBulkCreateMutation } from "./mutations";
import {
  giftCardBulkCreateErrorKeys,
  GiftCardBulkCreateFormData,
  GiftCardBulkCreateFormErrors
} from "./types";
import { GiftCardBulkCreate } from "./types/GiftCardBulkCreate";
import { validateForm } from "./utils";

const GiftCardBulkCreateDialog: React.FC<DialogProps> = ({ onClose, open }) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [formErrors, setFormErrors] = useState<GiftCardBulkCreateFormErrors>(
    null
  );
  const [issuedIds, setIssuedIds] = useState<string[] | null>(null);
  const [openIssueSuccessDialog, setOpenIssueSuccessDialog] = useState<boolean>(
    false
  );

  const onIssueSuccessDialogClose = () => setOpenIssueSuccessDialog(false);

  const { loading: loadingChannelCurrencies } = useChannelCurrencies({});

  const onCompleted = (data: GiftCardBulkCreate) => {
    const errors = data?.giftCardBulkCreate?.errors;
    const cardsAmount = data?.giftCardBulkCreate?.giftCards?.length || 0;

    const notifierData: IMessage = !!errors?.length
      ? {
          status: "error",
          text: intl.formatMessage(commonErrorMessages.unknownError)
        }
      : {
          status: "success",
          title: intl.formatMessage(messages.createdSuccessAlertTitle),
          text: intl.formatMessage(messages.createdSuccessAlertDescription, {
            cardsAmount
          })
        };

    notify(notifierData);

    setFormErrors(getFormErrors(giftCardBulkCreateErrorKeys, errors));

    if (!errors.length) {
      setIssuedIds(
        data?.giftCardBulkCreate?.giftCards?.map(giftCard => giftCard.id)
      );
      setOpenIssueSuccessDialog(true);
      onClose();
    }
  };

  const currentDate = useCurrentDate();

  const getParsedSubmitInputData = (
    formData: GiftCardBulkCreateFormData
  ): GiftCardBulkCreateInput => {
    const {
      balanceAmount,
      balanceCurrency,
      tag = null,
      requiresActivation,
      cardsAmount
    } = formData;

    return {
      count: cardsAmount,
      tag,
      balance: {
        amount: balanceAmount,
        currency: balanceCurrency
      },
      expiryDate: getGiftCardExpiryInputData(formData, currentDate),
      isActive: !requiresActivation
    };
  };

  const [
    bulkCreateGiftCard,
    bulkCreateGiftCardOpts
  ] = useGiftCardBulkCreateMutation({
    onCompleted,
    refetchQueries: [GIFT_CARD_LIST_QUERY]
  });

  const handleSubmit = (data: GiftCardBulkCreateFormData) => {
    const formErrors = validateForm(data);

    if (!!Object.keys(formErrors).length) {
      setFormErrors(formErrors);
    } else {
      bulkCreateGiftCard({
        variables: {
          input: getParsedSubmitInputData(data)
        }
      });
    }
  };

  const apiErrors = bulkCreateGiftCardOpts?.data?.giftCardBulkCreate?.errors;

  const handleSetSchemaErrors = () => {
    if (apiErrors?.length) {
      const formErrorsFromApi = getFormErrors(
        giftCardBulkCreateErrorKeys,
        apiErrors
      );

      setFormErrors(formErrorsFromApi);
    }
  };

  useEffect(handleSetSchemaErrors, [apiErrors]);

  return (
    <>
      <Dialog open={open} maxWidth="sm">
        <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
        <ContentWithProgress>
          {!loadingChannelCurrencies && (
            <GiftCardBulkCreateDialogForm
              opts={bulkCreateGiftCardOpts}
              onClose={onClose}
              formErrors={formErrors}
              onSubmit={handleSubmit}
            />
          )}
        </ContentWithProgress>
      </Dialog>
      <GiftCardCreateSuccessDialog
        onClose={onIssueSuccessDialogClose}
        open={openIssueSuccessDialog}
        idsToExport={issuedIds}
      />
    </>
  );
};

export default GiftCardBulkCreateDialog;

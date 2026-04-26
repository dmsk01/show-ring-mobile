/**
 * AccountBilling — mobile port (simplified).
 *
 * Divergence from web:
 *  - AccountBillingPayment (card management dialogs) removed — depends on
 *    `sections/payment` not yet ported. TODO(stage-5): restore.
 *  - AccountBillingAddress (address book with CustomPopover) removed — depends on
 *    `sections/address` not yet ported. TODO(stage-5): restore.
 *  - Grid replaced with Stack.
 */

import { Stack } from 'src/components/mui';

import { AccountBillingPlan } from './account-billing-plan';
import { AccountBillingHistory } from './account-billing-history';

import type { JSX } from 'react';
import type { IUserAccountBillingHistory } from 'src/types/user';
import type { IPaymentCard, IAddressItem } from 'src/types/common';

// ----------------------------------------------------------------------

type Props = {
  plans: { subscription: string; price: number; primary: boolean }[];
  cards: IPaymentCard[];
  addressBook: IAddressItem[];
  invoices: IUserAccountBillingHistory[];
};

export function AccountBilling({ plans, invoices }: Props): JSX.Element {
  return (
    <Stack spacing={3}>
      <AccountBillingPlan plans={plans} />
      <AccountBillingHistory invoices={invoices} />
    </Stack>
  );
}

AccountBilling.displayName = 'AccountBilling';

import { AccountBillingView } from 'src/sections/account/view';
import { AccountLayout } from 'src/sections/account/account-layout';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export default function AccountBillingPage(): JSX.Element {
  return (
    <AccountLayout>
      <AccountBillingView />
    </AccountLayout>
  );
}

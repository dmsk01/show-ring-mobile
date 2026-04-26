import { AccountLayout } from 'src/sections/account/account-layout';
import { AccountNotificationsView } from 'src/sections/account/view';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export default function AccountNotificationsPage(): JSX.Element {
  return (
    <AccountLayout>
      <AccountNotificationsView />
    </AccountLayout>
  );
}

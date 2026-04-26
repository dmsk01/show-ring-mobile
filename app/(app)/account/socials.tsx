import { AccountSocialsView } from 'src/sections/account/view';
import { AccountLayout } from 'src/sections/account/account-layout';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export default function AccountSocialsPage(): JSX.Element {
  return (
    <AccountLayout>
      <AccountSocialsView />
    </AccountLayout>
  );
}

import { AccountGeneralView } from 'src/sections/account/view';
import { AccountLayout } from 'src/sections/account/account-layout';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export default function AccountGeneralPage(): JSX.Element {
  return (
    <AccountLayout>
      <AccountGeneralView />
    </AccountLayout>
  );
}

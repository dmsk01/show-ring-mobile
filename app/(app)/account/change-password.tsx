import { AccountLayout } from 'src/sections/account/account-layout';
import { AccountChangePasswordView } from 'src/sections/account/view';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export default function AccountChangePasswordPage(): JSX.Element {
  return (
    <AccountLayout>
      <AccountChangePasswordView />
    </AccountLayout>
  );
}

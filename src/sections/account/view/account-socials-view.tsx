import { _userAbout } from 'src/_mock';

import { AccountSocials } from '../account-socials';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export function AccountSocialsView(): JSX.Element {
  return <AccountSocials socialLinks={_userAbout.socialLinks} />;
}

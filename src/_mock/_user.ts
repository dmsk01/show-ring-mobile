import type { IUserAbout, IUserAccountBillingHistory } from 'src/types/user';
import type { IPaymentCard, IAddressItem, ISocialLink } from 'src/types/common';

// ----------------------------------------------------------------------

export const _userAbout: IUserAbout = {
  id: 'user-about-1',
  role: 'admin',
  email: 'demo@showring.io',
  school: 'Stanford University',
  company: 'Show Ring Inc.',
  country: 'United States',
  coverUrl: '',
  totalFollowers: 4821,
  totalFollowing: 312,
  quote:
    'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
  socialLinks: {
    facebook: 'https://www.facebook.com/frankie',
    instagram: 'https://www.instagram.com/frankie',
    linkedin: 'https://www.linkedin.com/in/frankie',
    twitter: 'https://www.twitter.com/frankie',
  },
};

export const _userPayment: IPaymentCard[] = [
  { id: 'card-0', cardNumber: '**** **** **** 1234', cardType: 'mastercard', primary: false },
  { id: 'card-1', cardNumber: '**** **** **** 5678', cardType: 'visa', primary: true },
  { id: 'card-2', cardNumber: '**** **** **** 7878', cardType: 'visa', primary: false },
];

export const _userAddressBook: IAddressItem[] = [
  {
    id: 'addr-0',
    primary: true,
    name: 'Alex Johnson',
    phoneNumber: '+1-555-0100',
    fullAddress: '908 Jack Locks, Rancho Cordova, Virginia 85807',
    addressType: 'Home',
  },
  {
    id: 'addr-1',
    primary: false,
    name: 'Maria Garcia',
    phoneNumber: '+1-555-0101',
    fullAddress: '1600 Amphitheatre Pkwy, Mountain View, CA 94043',
    addressType: 'Office',
  },
  {
    id: 'addr-2',
    primary: false,
    name: 'Chris Lee',
    phoneNumber: '+1-555-0102',
    fullAddress: '350 Fifth Ave, New York, NY 10118',
    addressType: 'Office',
  },
];

export const _userInvoices: IUserAccountBillingHistory[] = Array.from({ length: 10 }, (_, i) => ({
  id: `inv-${i}`,
  invoiceNumber: `INV-199${i}`,
  createdAt: new Date(2025, 11 - i, 1).toISOString(),
  price: [9.99, 4.99, 9.99, 4.99, 9.99, 4.99, 9.99, 4.99, 9.99, 4.99][i],
}));

export const _userPlans: { subscription: string; price: number; primary: boolean }[] = [
  { subscription: 'basic', price: 0, primary: false },
  { subscription: 'starter', price: 4.99, primary: true },
  { subscription: 'premium', price: 9.99, primary: false },
];

export const _userSocialLinks: ISocialLink = _userAbout.socialLinks;

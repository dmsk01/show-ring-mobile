import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};

export type IUserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  zipCode: string;
  state: string;
  city: string;
  address: string;
  country: string;
  avatarUrl: string;
  isVerified: boolean;
  company: string;
  phoneNumber: string;
  status: string;
};

export type IUserAbout = {
  id: string;
  role: string;
  email: string;
  school: string;
  company: string;
  country: string;
  coverUrl: string;
  totalFollowers: number;
  totalFollowing: number;
  quote: string;
  socialLinks: ISocialLink;
};

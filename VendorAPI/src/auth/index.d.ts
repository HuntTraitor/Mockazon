export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface Vendor {
  id: string;
  vendor: VendorInfo;
  buisness: Buisness;
}

export interface VendorInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  countery: string;
  region: string;
  city: string;
  address: string;
  postalCode: string;
  email: string;
  phoneNumber: string;
  paymentInformation: Payment;
}

export interface Buisness {
  name: string;
  registrationNumber: string;
  countery: string;
  region: string;
  city: string;
  address: string;
  postalCode: string;
  bank: Bank;
}

export interface Bank {
  name: string;
  country: string;
  routingNumber: string;
  bankingNumber: string;
}

export interface Payment {
  name: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Authenticated {
  id: string;
  name: string;
  accessToken: string;
}

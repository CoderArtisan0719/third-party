import type { Id } from '../../convex/_generated/dataModel';

type InfoType = {
  index: number;
  key: string;
  value: string;
  isEdit: boolean;
};

type UserType = {
  type?: string;
  email: string;
  fullname: string;
  photo?: Id<'_storage'>;
  balance?: string;
  creationTime: number;
};

interface UserTableType extends UserType {
  _id: Id<'users'>;
  _creationTime: number;
}

type RequestType = {
  userId: Id<'users'>;
  kind: string;
  survey?: string;
  asset?: string;
  assetOther?: string;
  ALTAoptions: string[];
  propertyAddress: string;
  countyAccountInfo?: string;
  siteContactInfoName: string;
  siteContactInfoPhone: string;
  siteContactInfoEmail: string;
  turnaroundTime: string;
  specificDate: string;
  additionalInfo: InfoType[];
  otherSurvey: string;
  uploadCommits: string[];
  uploadSurveys: string[];
  uploadOthers: string[];
  receivedBids: Id<'bids'>[];
  receivedUsers: Id<'users'>[];
  requestUser: UserType;
  status: string;
};

interface RequestTableType extends RequestType {
  _id: Id<'requests'>;
  _creationTime: number;
  getCommitUrl?: URL;
  getSurveyUrl?: URL;
  getOtherUrl?: URL;
}

type BidType = {
  _id: Id<'bids'>;
  _creationTime: number;
  amount: number;
  unit: string;
  status: string;
  clientId: Id<'users'>;
  client: UserType;
  vendorId: Id<'users'>;
  vendor: UserType;
  requestId: Id<'requests'>;
  request: RequestTableType;
  workId?: Id<'_storage'>;
};

interface BidWithFileType extends BidType {
  getWorkUrl: URL;
}

type KPIType = {
  title: string;
  img: string;
  imgAlt: string;
  length: string;
  lists: { label: string; value?: number }[];
  link?: string;
};

type ChartTotalType = {
  title: string;
  value: number;
  vsYesterday: number;
}[];

type PaymentStatusType =
  | {
      status: string;
      id: string;
      totalMoney: {
        currency: string;
        amount: number;
      };
    }
  | null
  | 'idle';

type CardType = {
  amount: number;
  unit: string;
};

type PaymentCardType = {
  customer: {
    id: string;
    merchant_customer_id: string;
  };
  payment_source: {
    token: {
      id: string;
      type: string;
    };
    card: {
      number: string;
      expiry: string;
      name: string;
      billing_address: {
        address_line_1: string;
        address_line_2: string;
        admin_area_1: string;
        admin_area_2: string;
        postal_code: string;
        country_code: string;
      };
      experience_context: {
        brand_name: string;
        locale: string;
        return_url: string;
        cancel_url: string;
      };
    };
  };
};

type TransactionType = {
  sender: string;
  senderId: Id<'users'>;
  receiver: string;
  receiverId: Id<'users'>;
  amount: number;
  unit: string;
  _creationTime: number;
};

type TransactionTableType = {
  _id: Id<'transactions'>;
  _creationTime: number;
  bidId?: Id<'bids'> | undefined;
  type: string;
  amount: number;
  sender: UserTableType | null;
  senderId: string | Id<'users'>;
  receiver: UserTableType | null;
  receiverId: string | Id<'users'>;
};

export {
  BidType,
  BidWithFileType,
  CardType,
  ChartTotalType,
  InfoType,
  KPIType,
  PaymentCardType,
  PaymentStatusType,
  RequestTableType,
  RequestType,
  TransactionTableType,
  TransactionType,
  UserTableType,
  UserType,
};

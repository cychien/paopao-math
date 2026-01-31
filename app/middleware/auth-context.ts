import { createContext } from "react-router";

export interface CustomerData {
  customerId: string;
  appId: string;
  email: string;
  name: string | null;
  isFree: boolean;
}

export const customerContext = createContext<CustomerData>();

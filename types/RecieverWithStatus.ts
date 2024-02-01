import { Reciever } from "./index";

export type RecieverWithStatus = Reciever & {
    status: string;
  };
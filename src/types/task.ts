import { Timestamp } from "firebase/firestore";

export interface ITask {
  uid: string;
  title: string;
  timestamp: Timestamp;
};

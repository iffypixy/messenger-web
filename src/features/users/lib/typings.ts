import {ID} from "@lib/typings";

export interface User {
  id: ID;
  username: string;
  avatar: string;
  lastSeen: Date;
}
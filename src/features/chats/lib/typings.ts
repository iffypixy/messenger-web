import {ID} from "@lib/typings";

export interface ChatsListItem {
  id: ID;
  name: string;
  avatar: string;
  message: string | null;
  date: Date | null;
  numberOfUnreadMessages: number;
}
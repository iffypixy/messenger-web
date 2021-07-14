import {User} from "@features/users";
import {File, ID} from "@lib/typings";

export interface DirectDetails {
  id: ID;
}

export interface DirectsListItem extends Direct {
  lastMessage: DirectMessage;
  unread: number;
}

export interface DirectPartner extends User {
  isBanned: boolean;
}

export interface Direct {
  details: DirectDetails;
  partner: DirectPartner;
  isBanned: boolean;
}

export interface DirectMessage {
  id: ID;
  sender: DirectPartner | null;
  text: string;
  images: string[] | null;
  files: File[] | null;
  audio: string | null;
  chat: DirectDetails;
  parent: DirectMessage | null;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  createdAt: string;
}


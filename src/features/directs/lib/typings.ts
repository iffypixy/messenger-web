import {User} from "@features/users";
import {File, ID} from "@lib/typings";

export interface DirectChatDetails {
  id: ID;
}

export interface DirectChatPartner extends User {
  isBanned: boolean;
}

export interface DirectChat extends DirectChatDetails {
  partner: DirectChatPartner;
  isBanned: boolean;
}

export interface DirectChatMessage {
  id: ID;
  sender: DirectChatPartner | null;
  text: string | null;
  images: string[] | null;
  files: File[] | null;
  audio: string | null;
  chat: DirectChatDetails;
  parent: DirectChatMessage | null;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  createdAt: string;
}

export interface DirectChatsListItem extends DirectChat {
  lastMessage: DirectChatMessage;
  numberOfUnreadMessages: number;
}

import {ID} from "@lib/typings";

export interface DirectChatDetails {
  id: ID;
}

export interface DirectChatPartner {
  id: ID;
  username: string;
  avatar: string;
  lastSeen: Date;
  isBanned: boolean;
}

export interface DirectChat {
  chat: DirectChatDetails;
  partner: DirectChatPartner;
}

export interface DirectChatMessage {
  id: ID;
  sender: DirectChatPartner;
  text: string;
  images: string[];
  files: File[];
  audio: string;
  chat: DirectChatDetails;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  createdAt: Date;
}

export type DirectChatsList = (DirectChat & {lastMessage: DirectChatMessage})[];
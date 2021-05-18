import {User} from "@features/users";
import {File, ID} from "@lib/typings";

export interface GroupChatDetails {
  id: ID;
  avatar: string;
  title: string;
}

export interface GroupChatMember extends User {
  isOwner: boolean;
  isMember: boolean;
}

export interface GroupChat {
  chat: GroupChatDetails;
  member: GroupChatMember;
  numberOfMembers: number;
}

export interface GroupChatMessage {
  id: ID;
  text: string;
  sender: GroupChatMember | null;
  chat: GroupChatDetails;
  audio: string | null;
  images: string[] | null;
  files: File[] | null;
  parent: GroupChatMessage | null;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  createdAt: Date;
}

export type GroupChatsList = {
  chat: GroupChatDetails;
  lastMessage: GroupChatMessage | null;
  numberOfMembers: number;
}[];
import {User} from "@features/users";
import {File, ID} from "@lib/typings";

export interface GroupDetails {
  id: ID;
  avatar: string;
  title: string;
}

export interface GroupsListItem extends GroupDetails {
  lastMessage: GroupMessage | null;
  unread: number;
}

export interface GroupMember extends User {
  isOwner: boolean;
  isMember: boolean;
}

export interface Group extends GroupDetails {
  member: GroupMember;
  participants: number;
}

export interface GroupMessage {
  id: ID;
  text: string;
  sender: GroupMember | null;
  chat: GroupDetails;
  audio: string | null;
  images: string[] | null;
  files: File[] | null;
  parent: GroupMessage | null;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  createdAt: string;
}


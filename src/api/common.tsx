export type ID = string;

export type User = {
  id: ID;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  lastSeen: string;
  online: boolean;
}

export type File = {
  id: ID;
  extension: string;
  name: string;
  url: string;
  size: number;
}

export type Attachment = {
  audio: string | null;
  images: string[] | null;
  files: File[] | null;
}

export type Message = {
  id: ID;
  sender: User;
  text: string | null;
  attachments: Attachment | null;
  read: boolean;
  chatId: ID;
  createdAt: string;
}

export type Dialog = {
  id: ID;
  companion: User;
  lastMessage: Message;
  unreadMessagesNumber: number;
}

export type Discussion = {
  id: ID;
  members: User[];
  title: string;
  avatar: string;
}

export type DiscussionsListItem = {
  id: ID;
  members: User[];
  title: string;
  avatar: string;
  lastMessage: Message;
  unreadMessagesNumber: number;
}

export interface MessageData {
  text?: string;
  attachments?: {
    imagesIds?: string[];
    audioId?: string;
    filesIds?: string[];
  };
};
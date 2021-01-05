export type ID = string;

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface IFile {
  id: string;
  extension: string;
  name: string;
  url: string;
  size: number;
}

export interface IAttachments {
  audio?: string;
  images?: string[];
  files?: IFile[];
}

export interface IMessage {
  id: string;
  sender: IUser;
  text: string | undefined;
  attachments: IAttachments | undefined;
  isRead: boolean;
  createdAt: string;
}

export interface IDialogsListItem {
  id: string;
  companion: IUser;
  lastMessage: IMessage;
  unreadMessagesNumber: number;
}
import {ID} from "@lib/typings";

export interface ChatsListItem {
  id: ID;
  name: string;
  avatar: string;
  message: string | null;
  date: Date | null;
  unreadMessages: number;
  link: string;
}

export interface UploadingFile {
  id?: ID;
  key: string;
  url?: string;
  name?: string;
  size?: number;
  isUploading: boolean;
  progress: number;
}
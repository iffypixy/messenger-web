import {AxiosPromise} from "axios";

import {request, IRequestQuery} from "@lib/request";
import {IUser} from "./auth.api";

export interface IAttachments {
  audio: string | undefined;
  images: string[] | undefined;
  files: {
    id: string;
    extension: string;
    name: string;
    url: string;
    size: number;
  }[];
}

export interface IMessage {
  id: string;
  sender: IUser;
  text: string | undefined;
  attachments: IAttachments;
  isRead: boolean;
  createdAt: string;
}

const getDialogs = ({
  skip,
  take
}: IRequestQuery): AxiosPromise<{dialogs: IDialogsListItem[]}> =>
  request({
    url: "/api/dialogs",
    method: "GET",
    params: {skip, take},
    withCredentials: true
  });

export interface IGetMessagesData extends IRequestQuery {
  companionId: string;
}

const getMessages = ({companionId, take, skip}: IGetMessagesData) =>
  request({
    url: `/api/dialogs/${companionId}/messages`,
    method: "GET",
    params: {take, skip},
    withCredentials: true
  });

interface IMessageData {
  text: string | null;
  createdAt: Date;
  attachments: {
    imagesIds: string[];
    audioId: string;
    filesIds: string[];
  };
}

export interface ICreateMessageData {
  companionId: string;
  message: IMessageData;
}

const createMessage = ({
  companionId,
  message
}: ICreateMessageData): AxiosPromise<{message: IMessage}> =>
  request({
    url: `/api/dialogs/${companionId}/messages`,
    method: "POST",
    data: message,
    withCredentials: true
  });

export interface IGetDialogData {
  companionId: string;
}

export interface IDialogsListItem {
  id: string;
  companion: IUser;
  lastMessage: IMessage;
}

export interface IDialog {
  id: string;
  companion: IUser;
}

export const dialogApi = {
  getDialogs,
  getMessages,
  createMessage
};

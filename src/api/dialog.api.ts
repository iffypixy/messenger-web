import {AxiosPromise} from "axios";

import {request, IRequestQuery} from "@lib/request";
import {IMessage, IDialogsListItem} from "./common";

const getDialogs = (): AxiosPromise<{dialogs: IDialogsListItem[]}> => request({
  url: "/api/dialogs",
  method: "GET",
  withCredentials: true
});

export interface IGetMessagesData extends IRequestQuery {
  companionId: string;
}

const getMessages = ({companionId, take, skip}: IGetMessagesData):
  AxiosPromise<{messages: IMessage[]}> => request({
  url: `/api/dialogs/${companionId}/messages`,
  method: "GET",
  params: {take, skip},
  withCredentials: true
});

export interface ICreateMessageData {
  companionId: string;
  message: {
    text?: string | undefined;
    createdAt: string;
    attachments?: {
      imagesIds?: string[];
      audioId?: string;
      filesIds?: string[];
    };
  };
}

const createMessage = ({companionId, message}: ICreateMessageData):
  AxiosPromise<{message: IMessage}> => request({
  url: `/api/dialogs/${companionId}/messages`,
  method: "POST",
  data: message,
  withCredentials: true
});

export const dialogApi = {
  getDialogs,
  getMessages,
  createMessage
};

import {AxiosPromise} from "axios";

import {request, IRequestQuery} from "@lib/request";
import {IMessage, IDialogsListItem, ID} from "./common";

const getDialogs = (): AxiosPromise<{dialogs: IDialogsListItem[]}> => request({
  url: "/api/dialogs",
  method: "GET",
  withCredentials: true
});

export interface IGetMessagesData extends IRequestQuery {
  companionId: ID;
}

const getMessages = ({companionId, take, skip}: IGetMessagesData):
  AxiosPromise<{messages: IMessage[]}> => request({
  url: `/api/dialogs/${companionId}/messages`,
  method: "GET",
  params: {take, skip},
  withCredentials: true
});

export interface ICreateMessageData {
  companionId: ID;
  message: {
    text?: string | undefined;
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

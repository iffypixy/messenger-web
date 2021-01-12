import {AxiosPromise} from "axios";

import {request, RequestQuery} from "@lib/request";
import {Message, Dialog, ID, MessageData} from "./common";

const getDialogs = (): AxiosPromise<{dialogs: Dialog[]}> => request({
  url: "/api/dialogs",
  method: "GET",
  withCredentials: true
});

export interface GetMessagesData extends RequestQuery {
  companionId: ID;
}

const getMessages = ({companionId, limit, skip}: GetMessagesData): AxiosPromise<{messages: Message[]}> => request({
  url: `/api/dialogs/${companionId}/messages`,
  method: "GET",
  params: {limit, skip},
  withCredentials: true
});

export interface CreateMessageData {
  companionId: ID;
  message: MessageData;
}

const createMessage = ({companionId, message}: CreateMessageData): AxiosPromise<{message: Message}> => request({
  url: `/api/dialogs/${companionId}/messages`,
  method: "POST",
  data: message,
  withCredentials: true
});

export interface SetMessagesReadData {
  companionId: ID;
  messagesIds: ID[];
}

const setMessagesRead = ({companionId, messagesIds}: SetMessagesReadData): AxiosPromise<void> => request({
  method: "PUT",
  url: `/api/dialogs/${companionId}/messages/read`,
  data: {messagesIds},
  withCredentials: true
});

export const dialogApi = {
  getDialogs,
  getMessages,
  createMessage,
  setMessagesRead
};

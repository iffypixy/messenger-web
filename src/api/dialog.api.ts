import {AxiosPromise} from "axios";

import {request, RequestQuery} from "@lib/request";
import {Message, DialogsListItem, ID, MessageData} from "./common";

const getDialogs = (): AxiosPromise<{dialogs: DialogsListItem[]}> => request({
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

export interface GetAttachmentNumberData {
  companionId: ID;
}

const getAttachmentNumber = ({companionId}: GetAttachmentNumberData): AxiosPromise<{audios: number; images: number; files: number}> => request({
  method: "GET",
  url: `/api/dialogs/${companionId}/attachment`,
  withCredentials: true
});

export interface GetImagesData extends RequestQuery {
  companionId: ID;
}

const getImages = ({companionId, limit, skip}: GetImagesData): AxiosPromise<{images: string[]}> => request({
  method: "GET",
  url: `/api/dialogs/${companionId}/images`,
  params: {limit, skip}
});

export interface GetFilesData extends RequestQuery {
  companionId: ID;
}

const getFiles = ({companionId, limit, skip}: GetFilesData): AxiosPromise<{images: string[]}> => request({
  method: "GET",
  url: `/api/dialogs/${companionId}/files`,
  params: {limit, skip}
});

export interface GetAudiosData extends RequestQuery {
  companionId: ID;
}

const getAudios = ({companionId, limit, skip}: GetAudiosData): AxiosPromise<{images: string[]}> => request({
  method: "GET",
  url: `/api/dialogs/${companionId}/audios`,
  params: {limit, skip}
});

export const dialogApi = {
  getDialogs,
  getMessages,
  createMessage,
  setMessagesRead,
  getAttachmentNumber
};

import {AxiosPromise} from "axios";

import {AttachedImage, AttachedFile, AttachedAudio} from "@features/chats";
import {DirectsListItem, Direct, DirectMessage, DirectDetails} from "@features/directs";
import {ID} from "@lib/typings";
import {request} from "@lib/http";
import {socket} from "@lib/socket";

export interface GetDirectsResult {
  chats: DirectsListItem[];
}

const getDirects = (): AxiosPromise<GetDirectsResult> => request({
  url: "/directs",
  method: "GET"
});

export interface GetDirectData {
  partnerId: ID;
}

export interface GetDirectResult {
  chat: Direct;
}

const getDirect = ({partnerId}: GetDirectData): AxiosPromise<GetDirectResult> => request({
  url: `/directs/${partnerId}`,
  method: "GET"
});

export interface GetMessagesData {
  partnerId: ID;
  skip: number;
}

export interface GetMessagesResult {
  messages: DirectMessage[];
}

const getMessages = ({partnerId, skip}: GetMessagesData): AxiosPromise<GetMessagesResult> => request({
  url: `/directs/${partnerId}/messages`,
  method: "GET",
  params: {skip},
});

export interface SendMessageData {
  text?: string;
  audioId?: ID | null;
  imagesIds?: ID[] | null;
  filesIds?: ID[] | null;
  parentId?: ID | null;
  partnerId: ID;
}

export interface SendMessageResult {
  message: DirectMessage;
}

const sendMessage = (data: SendMessageData): Promise<{data: SendMessageResult}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:CREATE_MESSAGE", data, (data: SendMessageResult) => resolve({data}));
});

export interface ReadMessageData {
  partnerId: ID;
  messageId: ID;
}

export interface ReadMessageResult {
  message: DirectMessage;
  chat: DirectDetails;
}

const readMessage = (data: ReadMessageData): Promise<{data: ReadMessageResult}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:READ_MESSAGE", data, (data: ReadMessageResult) => resolve({data}));
});

export interface GetAttachedAudiosData {
  partnerId: ID;
  skip: number;
}

export interface GetAttachedAudiosResult {
  audios: AttachedAudio[];
}

const getAttachedAudios = ({partnerId, skip}: GetAttachedAudiosData): AxiosPromise<GetAttachedAudiosResult> => request({
  url: `/directs/${partnerId}/attached/audios`,
  method: "GET",
  params: {skip}
});

export interface GetAttachedImagesData {
  partnerId: ID;
  skip: number;
}

export interface GetAttachedImagesResult {
  images: AttachedImage[];
}

const getAttachedImages = ({partnerId, skip}: GetAttachedImagesData): AxiosPromise<GetAttachedImagesResult> => request({
  url: `/directs/${partnerId}/attached/images`,
  method: "GET",
  params: {skip}
});

export interface GetAttachedFilesData {
  partnerId: ID;
  skip: number;
}

export interface GetAttachedFilesResult {
  files: AttachedFile[];
}

const getAttachedFiles = ({partnerId, skip}: GetAttachedFilesData): AxiosPromise<GetAttachedFilesResult> => request({
  url: `/directs/${partnerId}/attached/files`,
  method: "GET",
  params: {skip}
});

export const directChatsApi = {
  getDirects, getDirect, getMessages,
  sendMessage, readMessage, getAttachedAudios,
  getAttachedImages, getAttachedFiles
};
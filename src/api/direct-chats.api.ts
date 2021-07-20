import {AxiosPromise} from "axios";

import {AttachedImage, AttachedFile, AttachedAudio} from "@features/chats";
import {DirectsListItem, Direct, DirectMessage} from "@features/directs";
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

const readMessage = (data: ReadMessageData): Promise<void> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:READ_MESSAGE", data, resolve);
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

export interface BanPartnerData {
  partnerId: ID;
}

const banPartner = (data: BanPartnerData): Promise<void> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:BAN_PARTNER", data, resolve);
});

export interface UnbanPartnerData {
  partnerId: ID;
}

const unbanPartner = (data: UnbanPartnerData): Promise<void> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:UNBAN_PARTNER", data, resolve);
});

export const directChatsApi = {
  getDirects, getDirect, getMessages,
  sendMessage, readMessage, getAttachedAudios,
  getAttachedImages, getAttachedFiles,
  banPartner, unbanPartner
};
import {AxiosPromise} from "axios";

import {AttachedFile, AttachedAudio, AttachedImage} from "@features/chats";
import {Group, GroupMessage, GroupsListItem, GroupDetails} from "@features/groups";
import {request} from "@lib/http";
import {ID} from "@lib/typings";
import {socket} from "@lib/socket";

export interface GetGroupsResult {
  chats: GroupsListItem[];
}

const getGroups = (): AxiosPromise<GetGroupsResult> => request({
  url: "/groups",
  method: "GET"
});

export interface GetGroupData {
  groupId: ID;
}

export interface GetGroupResult {
  chat: Group;
}

const getGroup = ({groupId}: GetGroupData): AxiosPromise<GetGroupResult> => request({
  url: `/groups/${groupId}`,
  method: "GET"
});

export interface GetMessagesData {
  groupId: ID;
  skip: number;
}

export interface GetMessagesResult {
  messages: GroupMessage[];
}

const getMessages = ({groupId, skip}: GetMessagesData): AxiosPromise<GetMessagesResult> => request({
  url: `/groups/${groupId}/messages`,
  method: "GET",
  data: {skip}
});

export interface SendMessageData {
  text?: string | null;
  audio?: ID | null;
  images?: ID[] | null;
  files?: ID[] | null;
  parent?: ID | null;
  group: ID;
}

export interface SendMessageResult {
  message: GroupMessage;
}

const sendMessage = (data: SendMessageData): Promise<{data: SendMessageResult}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:CREATE_MESSAGE", data, (data: SendMessageResult) => resolve({data}));
});

export interface ReadMessageData {
  group: ID;
  message: ID;
}

export interface ReadMessageResult {
  message: GroupMessage;
  chat: GroupDetails;
}

const readMessage = (data: ReadMessageData): Promise<{data: ReadMessageResult}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:READ_MESSAGE", data, (data: ReadMessageResult) => resolve({data}));
});

export interface GetAttachedAudiosData {
  groupId: ID;
  skip: number;
}

export interface GetAttachedAudiosResult {
  audios: AttachedAudio[];
}

const getAttachedAudios = ({groupId, skip}: GetAttachedAudiosData): AxiosPromise<GetAttachedAudiosResult> => request({
  url: `/groups/${groupId}/attached/audios`,
  method: "GET",
  data: {skip}
});

export interface GetAttachedImagesData {
  groupId: ID;
  skip: number;
}

export interface GetAttachedImagesResult {
  images: AttachedImage[];
}

const getAttachedImages = ({groupId, skip}: GetAttachedImagesData): AxiosPromise<GetAttachedImagesResult> => request({
  url: `/groups/${groupId}/attached/images`,
  method: "GET",
  data: {skip}
});

export interface GetAttachedFilesData {
  groupId: ID;
  skip: number;
}

export interface GetAttachedFilesResult {
  files: AttachedFile[];
}

const getAttachedFiles = ({groupId, skip}: GetAttachedFilesData): AxiosPromise<GetAttachedFilesResult> => request({
  url: `/groups/${groupId}/attached/images`,
  method: "GET",
  data: {skip}
});

export const groupChatsApi = {
  getGroups, getGroup, getMessages,
  sendMessage, readMessage, getAttachedFiles,
  getAttachedImages, getAttachedAudios
};


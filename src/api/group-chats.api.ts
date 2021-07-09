import {AttachedFile, AttachedAudio, AttachedImage} from "@features/chats";
import {GroupChat, GroupChatMessage, GroupChatsListItem, GroupChatDetails} from "@features/groups";
import {ID} from "@lib/typings";
import {socket} from "@lib/websocket";

export interface GetChatsResponse {
  chats: GroupChatsListItem[];
}

const getChats = (): Promise<{data: GetChatsResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:GET_CHATS", null, (data: GetChatsResponse) => resolve({data}));
});

export interface GetChatData {
  group: ID;
}

export interface GetChatResponse {
  chat: GroupChat;
}

const getChat = (data: GetChatData): Promise<{data: GetChatResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:GET_CHAT", data, (data: GetChatResponse) => resolve({data}));
});

export interface GetChatMessagesData {
  group: ID;
  skip?: number;
}

export interface GetChatMessagesResponse {
  messages: GroupChatMessage[];
}

const getMessages = (data: GetChatMessagesData): Promise<{data: GetChatMessagesResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:GET_MESSAGES", data, (data: GetChatMessagesResponse) => resolve({data}));
});

export interface SendMessageData {
  text?: string | null;
  audio?: ID | null;
  images?: ID[] | null;
  files?: ID[] | null;
  parent?: ID | null;
  group: ID;
}

export interface SendMessageResponse {
  message: GroupChatMessage;
}

const sendMessage = (data: SendMessageData): Promise<{data: SendMessageResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:CREATE_MESSAGE", data, (data: SendMessageResponse) => resolve({data}));
});

export interface ReadMessageData {
  group: ID;
  message: ID;
}

export interface ReadMessageResponse {
  message: GroupChatMessage;
  chat: GroupChatDetails;
}

const readMessage = (data: ReadMessageData): Promise<{data: ReadMessageResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:READ_MESSAGE", data, (data: ReadMessageResponse) => resolve({data}));
});

export interface GetAudiosData {
  group: ID;
  skip?: number;
}

export interface GetAudiosResponse {
  audios: AttachedAudio[];
}

const getAudios = (data: GetAudiosData): Promise<{data: GetAudiosResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:GET_AUDIOS", data, (data: GetAudiosResponse) => resolve({data}));
});

export interface GetImagesData {
  group: ID;
  skip?: number;
}

export interface GetImagesResponse {
  images: AttachedImage[];
}

const getImages = (data: GetImagesData): Promise<{data: GetImagesResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:GET_IMAGES", data, (data: GetImagesResponse) => resolve({data}));
});

export interface GetFilesData {
  group: ID;
  skip?: number;
}

export interface GetFilesResponse {
  files: AttachedFile[];
}

const getFiles = (data: GetFilesData): Promise<{data: GetFilesResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:GET_FILES", data, (data: GetFilesResponse) => resolve({data}));
});

export const groupChatsApi = {
  getChats, getChat, getMessages,
  sendMessage, readMessage, getAudios,
  getImages, getFiles
};


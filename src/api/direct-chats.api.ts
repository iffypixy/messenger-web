import {AttachedImage, AttachedFile, AttachedAudio} from "@features/chats";
import {DirectChatsListItem, DirectChat, DirectChatMessage, DirectChatDetails} from "@features/directs";
import {ID} from "@lib/typings";
import {socket} from "@lib/socket";

export interface GetChatsResponse {
  chats: DirectChatsListItem[];
}

const getChats = (): Promise<{data: GetChatsResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:GET_CHATS", null, (data: GetChatsResponse) => resolve({data}));
});

export interface GetChatData {
  partner: ID;
}

export interface GetChatResponse {
  chat: DirectChat;
}

const getChat = (data: GetChatData): Promise<{data: GetChatResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:GET_CHAT", data, (data: GetChatResponse) => resolve({data}));
});

export interface GetChatMessagesData {
  partner: ID;
  skip?: number;
}

export interface GetChatMessagesResponse {
  messages: DirectChatMessage[];
}

const getMessages = (data: GetChatMessagesData): Promise<{data: GetChatMessagesResponse}> =>
  new Promise((resolve) => {
    socket.emit("DIRECT_CHAT:GET_MESSAGES", data, (data: GetChatMessagesResponse) => resolve({data}));
  });

export interface SendMessageData {
  text?: string | null;
  audio?: ID | null;
  images?: ID[] | null;
  files?: ID[] | null;
  parent?: ID | null;
  partner: ID;
}

export interface SendMessageResponse {
  message: DirectChatMessage;
}

const sendMessage = (data: SendMessageData): Promise<{data: SendMessageResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:CREATE_MESSAGE", data, (data: SendMessageResponse) => resolve({data}));
});

export interface ReadMessageData {
  partner: ID;
  message: ID;
}

export interface ReadMessageResponse {
  message: DirectChatMessage;
  chat: DirectChatDetails;
}

const readMessage = (data: ReadMessageData): Promise<{data: ReadMessageResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:READ_MESSAGE", data, (data: ReadMessageResponse) => resolve({data}));
});

export interface GetAudiosData {
  partner: ID;
}

export interface GetAudiosResponse {
  audios: AttachedAudio[];
}

const getAudios = (data: GetAudiosData): Promise<{data: GetAudiosResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:GET_AUDIOS", data, (data: GetAudiosResponse) => resolve({data}));
});

export interface GetImagesData {
  partner: ID;
}

export interface GetImagesResponse {
  images: AttachedImage[];
}

const getImages = (data: GetImagesData): Promise<{data: GetImagesResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:GET_IMAGES", data, (data: GetImagesResponse) => resolve({data}));
});

export interface GetFilesData {
  partner: ID;
}

export interface GetFilesResponse {
  files: AttachedFile[];
}

const getFiles = (data: GetFilesData): Promise<{data: GetFilesResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:GET_FILES", data, (data: GetFilesResponse) => resolve({data}));
});

export const directChatsApi = {
  getChats, getChat, getMessages,
  sendMessage, readMessage, getAudios,
  getImages, getFiles
};
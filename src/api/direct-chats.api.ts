import {DirectChatsListItem, DirectChat, DirectChatMessage, DirectChatDetails} from "@features/directs";
import {ID} from "@lib/typings";
import {socket} from "@lib/websockets";

export interface GetDirectChatsResponse {
  chats: DirectChatsListItem[];
}

const getChats = (): Promise<{data: GetDirectChatsResponse}> =>
  new Promise((resolve) => {
    socket.emit("DIRECT_CHAT:GET_CHATS", null, (data: GetDirectChatsResponse) => resolve({data}));
  });

export interface GetDirectChatData {
  partner: ID;
}

export interface GetDirectChatResponse {
  chat: DirectChat;
}

const getChat = (data: GetDirectChatData): Promise<{data: GetDirectChatResponse}> =>
  new Promise((resolve) => {
    socket.emit("DIRECT_CHAT:GET_CHAT", data, (data: GetDirectChatResponse) => resolve({data}));
  });

export interface GetDirectChatMessagesData {
  partner: ID;
  skip?: number;
}

export interface GetDirectChatMessagesResponse {
  messages: DirectChatMessage[];
}

const getMessages = (data: GetDirectChatMessagesData): Promise<{data: GetDirectChatMessagesResponse}> =>
  new Promise((resolve) => {
    socket.emit("DIRECT_CHAT:GET_MESSAGES", data, (data: GetDirectChatMessagesResponse) => resolve({data}));
  });

export interface SendDirectMessageData {
  text?: string | null;
  audio?: ID | null;
  images?: ID[] | null;
  files?: ID[] | null;
  parent?: ID | null;
  partner: ID;
}

export interface SendDirectMessageResponse {
  message: DirectChatMessage;
}

const sendMessage = (data: SendDirectMessageData): Promise<{data: SendDirectMessageResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:CREATE_MESSAGE", data, (data: SendDirectMessageResponse) => resolve({data}))
});

export interface ReadDirectMessageData {
  partner: ID;
  message: ID;
}

export interface ReadDirectMessageResponse {
  message: DirectChatMessage;
  chat: DirectChatDetails;
}

const readMessage = (data: ReadDirectMessageData): Promise<{data: ReadDirectMessageResponse}> => new Promise((resolve) => {
  socket.emit("DIRECT_CHAT:READ_MESSAGE", data, (data: ReadDirectMessageResponse) => resolve({data}));
});

export const directChatsApi = {
  getChats, getChat, getMessages,
  sendMessage, readMessage
};
import {GroupChat, GroupChatMessage, GroupChatsListItem, GroupChatDetails} from "@features/groups";
import {ID} from "@lib/typings";
import {socket} from "@lib/websockets";

export interface GetGroupChatsResponse {
  chats: GroupChatsListItem[];
}

const getChats = (): Promise<{data: GetGroupChatsResponse}> =>
  new Promise((resolve) => {
    socket.emit("GROUP_CHAT:GET_CHATS", null, (data: GetGroupChatsResponse) => resolve({data}));
  });

export interface GetGroupChatData {
  group: ID;
}

export interface GetGroupChatResponse {
  chat: GroupChat;
}

const getChat = (data: GetGroupChatData): Promise<{data: GetGroupChatResponse}> =>
  new Promise((resolve) => {
    socket.emit("GROUP_CHAT:GET_CHAT", data, (data: GetGroupChatResponse) => resolve({data}));
  });

export interface GetGroupChatMessagesData {
  group: ID;
  skip?: number;
}

export interface GetGroupChatMessagesResponse {
  messages: GroupChatMessage[];
}

const getMessages = (data: GetGroupChatMessagesData): Promise<{data: GetGroupChatMessagesResponse}> =>
  new Promise((resolve) => {
    socket.emit("GROUP_CHAT:GET_MESSAGES", data, (data: GetGroupChatMessagesResponse) => resolve({data}));
  });

export interface SendGroupMessageData {
  text?: string | null;
  audio?: ID | null;
  images?: ID[] | null;
  files?: ID[] | null;
  parent?: ID | null;
  group: ID;
}

export interface SendGroupMessageResponse {
  message: GroupChatMessage;
}

const sendMessage = (data: SendGroupMessageData): Promise<{data: SendGroupMessageResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:CREATE_MESSAGE", data, (data: SendGroupMessageResponse) => resolve({data}));
});

export interface ReadGroupMessageData {
  group: ID;
  message: ID;
}

export interface ReadGroupMessageResponse {
  message: GroupChatMessage;
  chat: GroupChatDetails;
}

const readMessage = (data: ReadGroupMessageData): Promise<{data: ReadGroupMessageResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:READ_MESSAGE", data, (data: ReadGroupMessageResponse) => resolve({data}));
});

export const groupChatsApi = {
  getChats, getChat, getMessages,
  sendMessage, readMessage
};


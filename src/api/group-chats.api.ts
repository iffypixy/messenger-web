import {GroupChat, GroupChatMessage, GroupChatsListItem} from "@features/groups";
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
  chat: ID;
}

export interface GetGroupChatResponse {
  chat: GroupChat;
}

const getChat = (data: GetGroupChatData): Promise<{data: GetGroupChatResponse}> =>
  new Promise((resolve) => {
    socket.emit("GROUP_CHAT:GET_CHAT", data, (data: GetGroupChatResponse) => resolve({data}));
  });

export interface GetGroupChatMessagesData {
  chat: ID;
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
  chat: ID;
}

export interface SendGroupMessageResponse {
  message: GroupChatMessage;
}

const sendMessage = (data: SendGroupMessageData): Promise<{data: SendGroupMessageResponse}> => new Promise((resolve) => {
  socket.emit("GROUP_CHAT:CREATE_MESSAGE", data, (data: SendGroupMessageResponse) => resolve({data}))
});

export const groupChatsApi = {
  getChats, getChat, getMessages,
  sendMessage
};


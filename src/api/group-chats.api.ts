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
  id: ID;
}

export interface GetGroupChatResponse {
  chat: GroupChat;
}

const getChat = (data: GetGroupChatData): Promise<{data: GetGroupChatResponse}> =>
  new Promise((resolve) => {
    socket.emit("GROUP_CHAT:GET_CHAT", data, (data: GetGroupChatResponse) => resolve({data}));
  });

export interface GetGroupChatMessagesData {
  id: ID;
  skip?: number;
}

export interface GetGroupChatMessagesResponse {
  messages: GroupChatMessage[];
}

const getMessages = (data: GetGroupChatMessagesData): Promise<{data: GetGroupChatMessagesResponse}> =>
  new Promise((resolve) => {
    socket.emit("GROUP_CHAT:GET_MESSAGES", data, (data: GetGroupChatMessagesResponse) => resolve({data}));
  });

export const groupChatsApi = {
  getChats, getChat, getMessages
};


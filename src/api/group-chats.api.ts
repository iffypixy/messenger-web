import {AxiosPromise} from "axios";

import {GroupChat, GroupChatMessage, GroupChatsList} from "@features/groups";
import {request} from "@lib/http";
import {ID} from "@lib/typings";

export interface GetGroupChatsResponse {
  chats: GroupChatsList;
}

const getChats = (): AxiosPromise<GetGroupChatsResponse> => request({
  url: "/v1/api/group-chats",
  method: "GET"
});

export interface GetGroupChatData {
  id: ID;
}

export interface GetGroupChatResponse {
  chat: GroupChat;
}

const getChat = ({id}: GetGroupChatData): AxiosPromise<GetGroupChatResponse> => request({
  url: `/v1/api/group-chats/${id}`,
  method: "GET"
});

export interface GetGroupChatMessagesData {
  id: ID;
  skip?: number;
}

export interface GetGroupChatMessagesResponse {
  messages: GroupChatMessage[];
}

const getMessages = ({id, skip}: GetGroupChatMessagesData): AxiosPromise<GetGroupChatMessagesResponse> => request({
  url: `/v1/api/group-chats/${id}/messages`,
  params: {skip}
});

export const groupChatsApi = {
  getChats, getChat, getMessages
};


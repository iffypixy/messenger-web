import {AxiosPromise} from "axios";

import {DirectChatsList, DirectChat, DirectChatMessage} from "@features/directs";
import {request} from "@lib/http";
import {ID} from "@lib/typings";

export interface GetDirectChatsResponse {
  chats: DirectChatsList;
}

const getChats = (): AxiosPromise<GetDirectChatsResponse> => request({
  url: "/v1/api/1o1-chats",
  method: "GET"
});

export interface GetDirectChatData {
  partnerId: ID;
}

export interface GetDirectChatResponse {
  chat: DirectChat;
}

const getChat = ({partnerId}: GetDirectChatData): AxiosPromise<GetDirectChatResponse> => request({
  url: `/v1/api/1o1-chats/${partnerId}`,
  method: "GET"
});

export interface GetDirectChatMessagesData {
  partnerId: ID;
  skip?: number;
}

export interface GetDirectChatMessagesResponse {
  messages: DirectChatMessage[];
}

const getMessages = ({partnerId, skip}: GetDirectChatMessagesData): AxiosPromise<GetDirectChatMessagesResponse> => request({
  url: `/v1/api/1o1-chats/${partnerId}/messages`,
  params: {skip}
});

export const directChatsApi = {
  getChats, getChat, getMessages
};
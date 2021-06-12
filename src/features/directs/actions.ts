import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {
  directChatsApi,
  GetDirectChatData,
  GetDirectChatMessagesData,
  GetDirectChatMessagesResponse,
  GetDirectChatResponse,
  GetDirectChatsResponse,
  ReadDirectMessageData,
  ReadDirectMessageResponse,
  SendDirectMessageData,
  SendDirectMessageResponse
} from "@api/direct-chats.api";
import {ID} from "@lib/typings";
import {DirectChatMessage} from "./lib/typings";

const type = "directs";

export interface FetchChatsPayload extends GetDirectChatsResponse {
}

export const fetchChats = createAsyncThunk<FetchChatsPayload, void>(`${type}/fetchChats`, async () => {
  const {data} = await directChatsApi.getChats();

  return data;
});

export interface FetchChatPayload extends GetDirectChatResponse {
}

export interface FetchChatData extends GetDirectChatData {
  partnerId: ID;
}

export const fetchChat = createAsyncThunk<FetchChatPayload, FetchChatData>(`${type}/fetchChat`,
  async ({partner}) => {
    const {data} = await directChatsApi.getChat({partner});

    return data;
  });

export interface FetchMessagesPayload extends GetDirectChatMessagesResponse {
}

export interface FetchMessagesData extends GetDirectChatMessagesData {
  partnerId: ID;
}

export const fetchMessages = createAsyncThunk<FetchMessagesPayload, FetchMessagesData>(`${type}/fetchMessages`,
  async ({skip, partner}) => {
    const {data} = await directChatsApi.getMessages({skip, partner});

    return data;
  });

export interface FetchSendingMessagePayload extends SendDirectMessageResponse {
}

export interface FetchSendingMessageData extends SendDirectMessageData {
}

export const fetchSendingMessage = createAsyncThunk<FetchSendingMessagePayload, FetchSendingMessageData>(`${type}/fetchSendingMessage`,
  async (args) => {
    const {data} = await directChatsApi.sendMessage(args);

    return data;
  });

export interface FetchReadingMessageData extends ReadDirectMessageData {
}

export interface FetchReadingMessagePayload extends ReadDirectMessageResponse {
}

export const fetchReadingMessage = createAsyncThunk<FetchReadingMessagePayload, FetchReadingMessageData>(`${type}/fetchReadingMessage`,
  async (args) => {
    const {data} = await directChatsApi.readMessage(args);

    return data;
  });

export interface SetScrollPayload {
  partnerId: ID;
  scroll: number;
}

export const setScroll = createAction<SetScrollPayload>(`${type}/setScroll`);

export interface AddMessagePayload {
  partnerId: ID;
  message: DirectChatMessage;
  isOwn: boolean;
}

export const addMessage = createAction<AddMessagePayload>(`${type}/addMessage`);

export interface UpdateMessagePayload {
  partnerId: ID;
  messageId: ID;
  partial: Partial<DirectChatMessage>;
}

export const updateMessage = createAction<UpdateMessagePayload>(`${type}/updateMessage`);

export interface ReadMessagePayload {
  partnerId: ID;
  messageId: ID;
}

export const readMessage = createAction<ReadMessagePayload>(`${type}/readMessage`);

export interface SetNumberOfUnreadMessagesPayload {
  partnerId: ID;
  number: number;
}

export const setNumberOfUnreadMessages = createAction<SetNumberOfUnreadMessagesPayload>(`${type}/setNumberOfUnreadMessages`);
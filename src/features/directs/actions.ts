import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {
  directChatsApi,
  GetDirectChatData, GetDirectChatMessagesData,
  GetDirectChatMessagesResponse,
  GetDirectChatResponse,
  GetDirectChatsResponse, SendDirectMessageData, SendDirectMessageResponse
} from "@api/direct-chats.api";
import {DirectChatMessage} from "./lib/typings";
import {ID} from "@lib/typings";

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
  messageId: ID;
  partnerId: ID;
}

export const fetchSendingMessage = createAsyncThunk<FetchSendingMessagePayload, FetchSendingMessageData>(`${type}/fetchSendingMessage`,
  async ({parent, images, partner, files, audio, text}) => {
    const {data} = await directChatsApi.sendMessage({parent, images, files, audio, partner, text});

    return data;
  });

export interface AddMessagePayload {
  partnerId: ID;
  message: DirectChatMessage;
}

export const addMessage = createAction<AddMessagePayload>(`${type}/addMessage`);
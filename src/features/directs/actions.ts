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

export const fetchChats = createAsyncThunk<GetDirectChatsResponse, void>(`${type}/fetchChats`, async () => {
  const {data} = await directChatsApi.getChats();

  return data;
});

export const fetchChat = createAsyncThunk<GetDirectChatResponse, GetDirectChatData>(`${type}/fetchChat`, async (args) => {
  const {data} = await directChatsApi.getChat(args);

  return data;
});

export const fetchMessages = createAsyncThunk<GetDirectChatMessagesResponse, GetDirectChatMessagesData>(`${type}/fetchMessages`, async (args) => {
  const {data} = await directChatsApi.getMessages(args);

  return data;
});

export const fetchSendingMessage = createAsyncThunk<SendDirectMessageResponse, SendDirectMessageData>(`${type}/fetchSendingMessage`, async (args) => {
  const {data} = await directChatsApi.sendMessage(args);

  return data;
});

export interface AddDirectMessageData {
  message: DirectChatMessage;
  chatId: ID;
}

export const addMessage = createAction<AddDirectMessageData>(`${type}/addMessage`);

export interface UpdateDirectMessageData {
  id: ID;
  message: Partial<DirectChatMessage>;
}

export const updateMessage = createAction<UpdateDirectMessageData>(`${type}/updateMessage`);
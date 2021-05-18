import {createAsyncThunk} from "@reduxjs/toolkit";

import {
  directChatsApi,
  GetDirectChatData, GetDirectChatMessagesData,
  GetDirectChatMessagesResponse,
  GetDirectChatResponse,
  GetDirectChatsResponse
} from "@api/direct-chats.api";

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
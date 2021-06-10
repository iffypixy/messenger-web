import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {ID} from "@lib/typings";
import {
  groupChatsApi,
  GetGroupChatsResponse,
  GetGroupChatResponse,
  GetGroupChatData,
  GetGroupChatMessagesData,
  GetGroupChatMessagesResponse,
  SendGroupMessageResponse, SendGroupMessageData
} from "@api/group-chats.api";
import {GroupChatMessage} from "./lib/typings";

const type = "groups";

export const fetchChats = createAsyncThunk<GetGroupChatsResponse, void>(`${type}/fetchChats`, async () => {
  const {data} = await groupChatsApi.getChats();

  return data;
});

export interface FetchChatPayload extends GetGroupChatResponse {
}

export interface FetchChatData extends GetGroupChatData {
  groupId: ID;
}

export const fetchChat = createAsyncThunk<FetchChatPayload, FetchChatData>(`${type}/fetchChat`, async (args) => {
  const {data} = await groupChatsApi.getChat(args);

  return data;
});

export interface FetchMessagesPayload extends GetGroupChatMessagesResponse {
}

export interface FetchMessagesData extends GetGroupChatMessagesData {
  groupId: ID;
}

export const fetchMessages = createAsyncThunk<FetchMessagesPayload, FetchMessagesData>(`${type}/fetchMessages`, async (args) => {
  const {data} = await groupChatsApi.getMessages(args);

  return data;
});

export interface FetchSendingMessagePayload extends SendGroupMessageResponse {
}

export interface FetchSendingMessageData {
  message: SendGroupMessageData;
  groupId: ID;
  messageId: ID;
}

export const fetchSendingMessage = createAsyncThunk<FetchSendingMessagePayload, FetchSendingMessageData>(`${type}/fetchSendingMessage`, async ({message}) => {
  const {data} = await groupChatsApi.sendMessage(message);

  return data;
});

export interface SetScrollPayload {
  groupId: ID;
  scroll: number;
}

export const setScroll = createAction<SetScrollPayload>(`${type}/setScroll`);

export interface AddMessagePayload {
  message: GroupChatMessage;
  groupId: ID;
}

export const addMessage = createAction<AddMessagePayload>(`${type}/addMessage`);

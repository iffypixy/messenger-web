import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {ID} from "@lib/typings";
import {
  groupChatsApi,
  GetGroupChatsResponse,
  GetGroupChatResponse,
  GetGroupChatData,
  GetGroupChatMessagesData,
  GetGroupChatMessagesResponse,
  SendGroupMessageResponse, SendGroupMessageData, ReadGroupMessageData, ReadGroupMessageResponse
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

export interface FetchSendingMessageData extends SendGroupMessageData {
}

export const fetchSendingMessage = createAsyncThunk<FetchSendingMessagePayload, FetchSendingMessageData>(`${type}/fetchSendingMessage`, async (args) => {
  const {data} = await groupChatsApi.sendMessage(args);

  return data;
});

export interface FetchReadingMessageData extends ReadGroupMessageData {
}

export interface FetchReadingMessagePayload extends ReadGroupMessageResponse {
}

export const fetchReadingMessage = createAsyncThunk<FetchReadingMessagePayload, FetchReadingMessageData>(`${type}/fetchReadingMessage`,
  async (args) => {
    const {data} = await groupChatsApi.readMessage(args);

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
  isOwn: boolean;
}

export const addMessage = createAction<AddMessagePayload>(`${type}/addMessage`);

export interface UpdateMessagePayload {
  groupId: ID;
  messageId: ID;
  partial: Partial<GroupChatMessage>;
}

export const updateMessage = createAction<UpdateMessagePayload>(`${type}/updateMessage`);

export interface ReadMessagePayload {
  groupId: ID;
  messageId: ID;
}

export const readMessage = createAction<ReadMessagePayload>(`${type}/readMessage`);

export interface SetNumberOfUnreadMessagesPayload {
  groupId: ID;
  number: number;
}

export const setNumberOfUnreadMessages = createAction<SetNumberOfUnreadMessagesPayload>(`${type}/setNumberOfUnreadMessages`);
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

export const fetchChat = createAsyncThunk<GetGroupChatResponse, GetGroupChatData>(`${type}/fetchChat`, async (args) => {
  const {data} = await groupChatsApi.getChat(args);

  return data;
});

export const fetchMessages = createAsyncThunk<GetGroupChatMessagesResponse, GetGroupChatMessagesData>(`${type}/fetchMessages`, async (args) => {
  const {data} = await groupChatsApi.getMessages(args);

  return data;
});

export const fetchSendingMessage = createAsyncThunk<SendGroupMessageResponse, SendGroupMessageData>(`${type}/fetchSendingMessage`, async (args) => {
  const {data} = await groupChatsApi.sendMessage(args);

  return data;
});

export interface AddGroupMessageData {
  message: GroupChatMessage;
  chatId: ID;
}

export const addMessage = createAction<AddGroupMessageData>(`${type}/addMessage`);

export interface UpdateGroupMessageData {
  id: ID;
  message: Partial<GroupChatMessage>;
}

export const updateMessage = createAction<UpdateGroupMessageData>(`${type}/updateMessage`);
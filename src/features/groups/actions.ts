import {createAsyncThunk} from "@reduxjs/toolkit";

import {groupChatsApi, GetGroupChatsResponse, GetGroupChatResponse, GetGroupChatData, GetGroupChatMessagesData, GetGroupChatMessagesResponse} from "@api/group-chats.api";

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
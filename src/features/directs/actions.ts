import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {
  directChatsApi,
  GetDirectData,
  GetMessagesData,
  GetMessagesResult,
  GetDirectResult,
  GetDirectsResult,
  ReadMessageData,
  ReadMessageResult,
  SendMessageData,
  SendMessageResult,
  GetAttachedAudiosResult,
  GetAttachedAudiosData, GetAttachedImagesData, GetAttachedImagesResult, GetAttachedFilesData, GetAttachedFilesResult
} from "@api/direct-chats.api";
import {ID} from "@lib/typings";
import {Direct, DirectMessage} from "./lib/typings";

const type = "directs";

export interface FetchChatsPayload extends GetDirectsResult {
}

export const fetchChats = createAsyncThunk<FetchChatsPayload, void>(`${type}/fetchChats`, async () => {
  const {data} = await directChatsApi.getDirects();

  return data;
});

export interface FetchChatPayload extends GetDirectResult {
}

export interface FetchChatData extends GetDirectData {
}

export const fetchChat = createAsyncThunk<FetchChatPayload, FetchChatData>(`${type}/fetchChat`,
  async ({partnerId}) => {
    const {data} = await directChatsApi.getDirect({partnerId});

    return data;
  });

export interface FetchMessagesPayload extends GetMessagesResult {
}

export interface FetchMessagesData extends GetMessagesData {
}

export const fetchMessages = createAsyncThunk<FetchMessagesPayload, FetchMessagesData>(`${type}/fetchMessages`,
  async ({skip, partnerId}) => {
    const {data} = await directChatsApi.getMessages({skip, partnerId});

    return data;
  });

export interface FetchSendingMessagePayload extends SendMessageResult {
}

export interface FetchSendingMessageData extends SendMessageData {
}

export const fetchSendingMessage = createAsyncThunk<FetchSendingMessagePayload, FetchSendingMessageData>(`${type}/fetchSendingMessage`,
  async (args) => {
    const {data} = await directChatsApi.sendMessage(args);

    return data;
  });

export interface FetchReadingMessageData extends ReadMessageData {
}

export interface FetchReadingMessagePayload extends ReadMessageResult {
}

export const fetchReadingMessage = createAsyncThunk<FetchReadingMessagePayload, FetchReadingMessageData>(`${type}/fetchReadingMessage`,
  async (args) => {
    const {data} = await directChatsApi.readMessage(args);

    return data;
  });

export interface FetchAttachedAudiosData extends GetAttachedAudiosData {
}

export interface FetchAttachedAudiosPayload extends GetAttachedAudiosResult {
}

export const fetchAttachedAudios = createAsyncThunk<FetchAttachedAudiosPayload, FetchAttachedAudiosData>(`${type}/fetchAttachedAudios`,
  async (args) => {
    const {data} = await directChatsApi.getAttachedAudios(args);

    return data;
  });

export interface FetchAttachedImagesData extends GetAttachedImagesData {
}

export interface FetchAttachedImagesPayload extends GetAttachedImagesResult {
}

export const fetchAttachedImages = createAsyncThunk<FetchAttachedImagesPayload, FetchAttachedImagesData>(`${type}/fetchAttachedImages`,
  async (args) => {
    const {data} = await directChatsApi.getAttachedImages(args);

    return data;
  });

export interface FetchAttachedFilesData extends GetAttachedFilesData {
}

export interface FetchAttachedFilesPayload extends GetAttachedFilesResult {
}

export const fetchAttachedFiles = createAsyncThunk<FetchAttachedFilesPayload, FetchAttachedFilesData>(`${type}/fetchAttachedFiles`,
  async (args) => {
    const {data} = await directChatsApi.getAttachedFiles(args);

    return data;
  });

export interface AddMessagePayload {
  partnerId: ID;
  message: DirectMessage;
  chat: Direct;
  isOwn: boolean;
}

export const addMessage = createAction<AddMessagePayload>(`${type}/addMessage`);

export interface UpdateMessagePayload {
  partnerId: ID;
  messageId: ID;
  partial: Partial<DirectMessage>;
}

export const updateMessage = createAction<UpdateMessagePayload>(`${type}/updateMessage`);

export interface SetMessagesReadPayload {
  partnerId: ID;
  messageId: ID;
}

export const setMessagesRead = createAction<SetMessagesReadPayload>(`${type}/setMessagesRead`);

export interface SetUnreadPayload {
  partnerId: ID;
  unread: number;
}

export const setUnread = createAction<SetUnreadPayload>(`${type}/setUnread`);

export interface SetDirectPayload {
  partnerId: ID;
  direct: Direct;
}

export const setDirect = createAction<SetDirectPayload>(`${type}/setDirect`);
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {
  directChatsApi,
  GetChatData,
  GetChatMessagesData,
  GetChatMessagesResponse,
  GetChatResponse,
  GetChatsResponse,
  ReadMessageData,
  ReadMessageResponse,
  SendMessageData,
  SendMessageResponse,
  GetAudiosResponse,
  GetAudiosData, GetImagesData, GetImagesResponse, GetFilesData, GetFilesResponse
} from "@api/direct-chats.api";
import {ID} from "@lib/typings";
import {DirectChat, DirectChatMessage, DirectChatPartner} from "./lib/typings";
import {User} from "@features/users";

const type = "directs";

export interface FetchChatsPayload extends GetChatsResponse {
}

export const fetchChats = createAsyncThunk<FetchChatsPayload, void>(`${type}/fetchChats`, async () => {
  const {data} = await directChatsApi.getChats();

  return data;
});

export interface FetchChatPayload extends GetChatResponse {
}

export interface FetchChatData extends GetChatData {
  partnerId: ID;
}

export const fetchChat = createAsyncThunk<FetchChatPayload, FetchChatData>(`${type}/fetchChat`,
  async ({partner}) => {
    const {data} = await directChatsApi.getChat({partner});

    return data;
  });

export interface FetchMessagesPayload extends GetChatMessagesResponse {
}

export interface FetchMessagesData extends GetChatMessagesData {
  partnerId: ID;
}

export const fetchMessages = createAsyncThunk<FetchMessagesPayload, FetchMessagesData>(`${type}/fetchMessages`,
  async ({skip, partner}) => {
    const {data} = await directChatsApi.getMessages({skip, partner});

    return data;
  });

export interface FetchSendingMessagePayload extends SendMessageResponse {
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

export interface FetchReadingMessagePayload extends ReadMessageResponse {
}

export const fetchReadingMessage = createAsyncThunk<FetchReadingMessagePayload, FetchReadingMessageData>(`${type}/fetchReadingMessage`,
  async (args) => {
    const {data} = await directChatsApi.readMessage(args);

    return data;
  });

export interface FetchAudiosData extends GetAudiosData {
  partnerId: ID;
}

export interface FetchAudiosPayload extends GetAudiosResponse {
}

export const fetchAudios = createAsyncThunk<FetchAudiosPayload, FetchAudiosData>(`${type}/fetchAudios`,
  async (args) => {
    const {data} = await directChatsApi.getAudios(args);

    return data;
  });

export interface FetchImagesData extends GetImagesData {
  partnerId: ID;
}

export interface FetchImagesPayload extends GetImagesResponse {
}

export const fetchImages = createAsyncThunk<FetchImagesPayload, FetchImagesData>(`${type}/fetchImages`,
  async (args) => {
    const {data} = await directChatsApi.getImages(args);

    return data;
  });

export interface FetchFilesData extends GetFilesData {
  partnerId: ID;
}

export interface FetchFilesPayload extends GetFilesResponse {
}

export const fetchFiles = createAsyncThunk<FetchFilesPayload, FetchFilesData>(`${type}/fetchFiles`,
  async (args) => {
    const {data} = await directChatsApi.getFiles(args);

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

export interface AddChatPayload {
  partnerId: ID;
  chat: DirectChat;
}

export const addChat = createAction<AddChatPayload>(`${type}/addChat`);
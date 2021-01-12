import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {dialogApi, GetMessagesData, CreateMessageData} from "@api/dialog.api";
import {User, Message, Dialog, ID} from "@api/common";
import {userApi, GetUserData} from "@api/user.api";

const typePrefix = "chat/dialogs";

export const fetchMessages = createAsyncThunk<{messages: Message[]}, GetMessagesData>(`${typePrefix}/fetchMessages`, async ({companionId, skip, limit}) => {
  const {data} = await dialogApi.getMessages({companionId, limit, skip});

  return data;
});

export const fetchDialogs = createAsyncThunk<{dialogs: Dialog[]}>(`${typePrefix}/fetchDialogs`, async () => {
  const {data} = await dialogApi.getDialogs();

  return data;
});

export const fetchCreateMessage = createAsyncThunk<{message: Message}, CreateMessageData>(`${typePrefix}/fetchCreateMessage`, async ({companionId, message}) => {
  const {data} = await dialogApi.createMessage({companionId, message});

  return data;
});

export const fetchCompanion = createAsyncThunk<{user: User}, GetUserData>(`${typePrefix}/fetchCompanion`, async ({id}) => {
  const {data} = await userApi.getUser({id});

  return data;
});

export const updateMessage = createAction<{messageId: ID; companionId: ID; updatedMessage: Message}>(`${typePrefix}/updateMessage`);

export const setCompanionStatus = createAction<{companionId: ID; status: string | null}>(`${typePrefix}/setCompanionStatus`);

export const addCompanionMessage = createAction<{message: Message}>(`${typePrefix}/addCompanionMessage`);

export const addMessage = createAction<{message: Message}>(`${typePrefix}/addMessage`);

export const setCurrentCompanionId = createAction<{id: ID}>(`${typePrefix}/setCurrentCompanionId`);

export const setMessagesRead = createAction<{ids: ID[]; companionId: ID}>(`${typePrefix}/setMessagesRead`);

export const setCompanionOnlineStatus = createAction<{online: boolean; companionId: ID}>(`${typePrefix}/setCompanionOnlineStatus`);

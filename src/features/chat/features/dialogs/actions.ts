import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {AppState} from "redux";

import {dialogApi, GetMessagesData, CreateMessageData, SetMessagesReadData} from "@api/dialog.api";
import {User, Message, DialogsListItem, ID} from "@api/common";
import {userApi, GetUserData} from "@api/user.api";
import {CompanionOptions} from "@features/chat";

const typePrefix = "chat/dialogs";

export const fetchMessages = createAsyncThunk<{messages: Message[]}, GetMessagesData, {state: AppState}>(`${typePrefix}/fetchMessages`, async ({companionId, skip, limit}) => {
  const {data} = await dialogApi.getMessages({companionId, limit, skip});

  return data;
});

export const fetchDialogs = createAsyncThunk<{dialogs: (DialogsListItem & {companion: User & CompanionOptions})[]}, void, {state: AppState}>(`${typePrefix}/fetchDialogs`, async (_, thunkApi) => {
  const {data} = await dialogApi.getDialogs();

  const state = thunkApi.getState();

  return {
    dialogs: data.dialogs.map((dialog) => ({
      ...dialog,
      companion: {
        ...dialog.companion,
        online: state.user.data.onlineUsersIds.includes(dialog.companion.id),
        status: null
      }
    }))
  };
});

export const fetchCreateMessage = createAsyncThunk<{message: Message}, CreateMessageData, {state: AppState}>(`${typePrefix}/fetchCreateMessage`, async ({companionId, message}) => {
  const {data} = await dialogApi.createMessage({companionId, message});

  return data;
});

export const fetchCompanion = createAsyncThunk<{companion: User & CompanionOptions}, GetUserData, {state: AppState}>(`${typePrefix}/fetchCompanion`, async ({id}, thunkApi) => {
  const {data} = await userApi.getUser({id});

  const state = thunkApi.getState();

  return {
    companion: {
      ...data.user,
      online: state.user.data.onlineUsersIds.includes(data.user.id),
      status: null
    }
  };
});

export const fetchReadMessages = createAsyncThunk<void, SetMessagesReadData>(`${typePrefix}/fetchReadMessages`, async ({companionId, messagesIds}) => {
  const {data} = await dialogApi.setMessagesRead({companionId, messagesIds});

  return data;
});

export const updateMessage = createAction<{messageId: ID; companionId: ID; updatedMessage: Message}>(`${typePrefix}/updateMessage`);

export const addCompanionMessage = createAction<{message: Message}>(`${typePrefix}/addCompanionMessage`);

export const addMessage = createAction<{message: Message}>(`${typePrefix}/addMessage`);

export const setCurrentCompanionId = createAction<{id: ID}>(`${typePrefix}/setCurrentCompanionId`);

export const setMessagesRead = createAction<{ids: ID[]; companionId: ID}>(`${typePrefix}/setMessagesRead`);

export const updateCompanion = createAction(`${typePrefix}/updateCompanion`);
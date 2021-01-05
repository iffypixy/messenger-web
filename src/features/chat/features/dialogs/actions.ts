import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {dialogApi, IGetMessagesData, ICreateMessageData} from "@api/dialog.api";
import {IUser, IMessage, IDialogsListItem, ID} from "@api/common";
import {userApi, GetUserData} from "@api/user.api";

const typePrefix = "chat/dialogs";

export const fetchMessages = createAsyncThunk<{messages: IMessage[]}, IGetMessagesData>(`${typePrefix}/fetchMessages`, async ({companionId, skip, take}) => {
  const {data} = await dialogApi.getMessages({companionId, take, skip});

  return data;
});

export const fetchDialogs = createAsyncThunk<{dialogs: IDialogsListItem[]}>(`${typePrefix}/fetchDialogs`, async () => {
  const {data} = await dialogApi.getDialogs();

  return data;
});

export const fetchCreateMessage = createAsyncThunk<{message: IMessage}, ICreateMessageData>(`${typePrefix}/fetchCreateMessage`, async ({companionId, message}) => {
  const {data} = await dialogApi.createMessage({companionId, message});

  return data;
});

export const fetchCompanion = createAsyncThunk<{user: IUser}, GetUserData>(`${typePrefix}/fetchCompanion`, async ({id}) => {
  const {data} = await userApi.getUser({id});

  return data;
});

export const updateMessage = createAction<{messageId: ID; companionId: ID; updatedMessage: IMessage}>(`${typePrefix}/updateMessage`);

export const setCompanionStatus = createAction<{companionId: ID; status: string | null}>(`${typePrefix}/setCompanionStatus`);

export const addCompanionMessage = createAction<{message: IMessage}>(`${typePrefix}/addCompanionMessage`);

export const addMessage = createAction<{message: IMessage}>(`${typePrefix}/addMessage`);

export const setCurrentCompanionId = createAction<{id: ID}>(`${typePrefix}/setCurrentCompanionId`);

export const setMessagesRead = createAction<{ids: ID[]; companionId: ID}>(`${typePrefix}/setMessagesRead`);

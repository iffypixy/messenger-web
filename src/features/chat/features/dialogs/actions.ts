import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {dialogApi, IGetMessagesData, ICreateMessageData} from "@api/dialog.api";
import {IUser, IMessage, IDialogsListItem} from "@api/common";
import {userApi} from "@api/user.api";

const typePrefix = "chat/dialogs";

export const fetchMessages = createAsyncThunk<{messages: IMessage[]}, IGetMessagesData>(`${typePrefix}/fetchMessages`, async (args) => {
  const {data} = await dialogApi.getMessages(args);

  return data;
});

export const fetchDialogs = createAsyncThunk<{dialogs: IDialogsListItem[]}>(`${typePrefix}/fetchDialogs`, async () => {
  const {data} = await dialogApi.getDialogs();

  return data;
});

export const fetchCreateMessage = createAsyncThunk<{message: IMessage}, ICreateMessageData & {tempMessageId: string}>(`${typePrefix}/fetchCreateMessage`, async ({companionId, message}) => {
  const {data} = await dialogApi.createMessage({companionId, message});

  return data;
});

export const fetchCompanion = createAsyncThunk<{user: IUser}, string>(`${typePrefix}/fetchCompanion`, async (id) => {
  const {data} = await userApi.getUser(id);

  return data;
});

export const updateMessage = createAction<{messageId: string; companionId: string; updatedMessage: IMessage}>(`${typePrefix}/updateMessage`);

export const addCompanionMessage = createAction<IMessage>(`${typePrefix}/addCompanionMessage`);

export const addMessage = createAction(`${typePrefix}/addMessage`);

export const setCurrentCompanionId = createAction<string>(`${typePrefix}/setCurrentCompanionId`);

export const setMessagesRead = createAction<string[]>(`${typePrefix}/setMessagesRead`);

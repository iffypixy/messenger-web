import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {dialogApi, IMessage, IGetMessagesData, ICreateMessageData, IDialog} from "@api/dialog.api";
import {IRequestQuery} from "@lib/interfaces";
import {IUser} from "@api/auth.api";
import {userApi} from "@api/user.api";

const typePrefix = "chat/dialogs";

export const fetchMessages = createAsyncThunk<{messages: IMessage[]}, IGetMessagesData>(`${typePrefix}/fetchMessages`, async (args) => {
    const {data} = await dialogApi.getMessages(args);

    return data;
});

export const fetchDialogs = createAsyncThunk<{dialogs: IDialog[]}, IRequestQuery>(`${typePrefix}/fetchDialogs`, async (args) => {
    const {data} = await dialogApi.getDialogs(args);

    return data;
});

export const fetchCreateMessage = createAsyncThunk<{message: IMessage}, ICreateMessageData>(`${typePrefix}/fetchCreateMessage`, async (args) => {
    const {data} = await dialogApi.createMessage(args);

    return data;
});

export const fetchCompanion = createAsyncThunk<{user: IUser}, string>(`${typePrefix}/fetchCompanion`, async (id) => {
    const {data} = await userApi.getUser(id);

    return data;
});

export const addCompanionMessage = createAction<IMessage>(`${typePrefix}/addCompanionMessage`);

export const addMessage = createAction(`${typePrefix}/addMessage`);

export const setCurrentCompanionId = createAction<string>(`${typePrefix}/setCurrentCompanionId`);

export const setMessagesRead = createAction<string[]>(`${typePrefix}/setMessagesRead`);

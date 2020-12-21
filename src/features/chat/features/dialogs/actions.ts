import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {dialogApi, Message, GetMessagesData, CreateMessageData, Dialog, GetDialogData} from "@api/dialog.api";
import {RequestQuery} from "@lib/interfaces";

const typePrefix = "chat/dialogs";

export const fetchMessages = createAsyncThunk<{messages: Message[]}, GetMessagesData>(`${typePrefix}/fetchMessages`, async (args) => {
    const {data} = await dialogApi.getMessages(args);

    return data;
});

export const fetchDialogs = createAsyncThunk<{dialogs: Dialog[]}, RequestQuery>(`${typePrefix}/fetchDialogs`, async (args) => {
    const {data} = await dialogApi.getDialogs(args);

    return data;
});

export const fetchCreateMessage = createAsyncThunk<{message: Message}, CreateMessageData>(`${typePrefix}/fetchCreateMessage`, async (args) => {
    const {data} = await dialogApi.createMessage(args);

    return data;
});

export const fetchDialog = createAsyncThunk<{dialog: Dialog}, GetDialogData>(`${typePrefix}/fetchDialog`, async (args) => {
    const {data} = await dialogApi.getDialog(args);

    return data;
});

export const setCurrentCompanionId = createAction<number>(`${typePrefix}/setCurrentCompanionId`);

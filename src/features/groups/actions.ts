import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {ID} from "@lib/typings";
import {
  groupChatsApi,
  GetGroupsResult,
  GetGroupResult,
  GetGroupData,
  GetMessagesData,
  GetMessagesResult,
  SendMessageResult, SendMessageData, ReadMessageData, ReadMessageResult
} from "@api/group-chats.api";
import {Group, GroupMember, GroupMessage} from "./lib/typings";

const type = "groups";

export interface FetchChatsPayload extends GetGroupsResult {
}

export const fetchChats = createAsyncThunk<GetGroupsResult, void>(`${type}/fetchChats`, async () => {
  const {data} = await groupChatsApi.getGroups();

  return data;
});

export interface FetchChatPayload extends GetGroupResult {
}

export interface FetchChatData extends GetGroupData {
  groupId: ID;
}

export const fetchChat = createAsyncThunk<FetchChatPayload, FetchChatData>(`${type}/fetchChat`, async (args) => {
  const {data} = await groupChatsApi.getGroup(args);

  return data;
});

export interface FetchMessagesPayload extends GetMessagesResult {
}

export interface FetchMessagesData extends GetMessagesData {
  groupId: ID;
}

export const fetchMessages = createAsyncThunk<FetchMessagesPayload, FetchMessagesData>(`${type}/fetchMessages`, async (args) => {
  const {data} = await groupChatsApi.getMessages(args);

  return data;
});

export interface FetchSendingMessagePayload extends SendMessageResult {
}

export interface FetchSendingMessageData extends SendMessageData {
}

export const fetchSendingMessage = createAsyncThunk<FetchSendingMessagePayload, FetchSendingMessageData>(`${type}/fetchSendingMessage`, async (args) => {
  const {data} = await groupChatsApi.sendMessage(args);

  return data;
});

export interface FetchReadingMessageData extends ReadMessageData {
}

export interface FetchReadingMessagePayload extends ReadMessageResult {
}

export const fetchReadingMessage = createAsyncThunk<FetchReadingMessagePayload, FetchReadingMessageData>(`${type}/fetchReadingMessage`,
  async (args) => {
    const {data} = await groupChatsApi.readMessage(args);

    return data;
  });

export interface AddMessagePayload {
  groupId: ID;
  message: GroupMessage;
  isOwn: boolean;
}

export const addMessage = createAction<AddMessagePayload>(`${type}/addMessage`);

export interface UpdateMessagePayload {
  groupId: ID;
  messageId: ID;
  partial: Partial<GroupMessage>;
}

export const updateMessage = createAction<UpdateMessagePayload>(`${type}/updateMessage`);

export interface ReadMessagePayload {
  groupId: ID;
  messageId: ID;
}

export const readMessage = createAction<ReadMessagePayload>(`${type}/readMessage`);

export interface SetUnreadPayload {
  groupId: ID;
  unread: number;
}

export const setUnread = createAction<SetUnreadPayload>(`${type}/setUnread`);

export interface AddChatPayload {
  group: Group;
}

export const addChat = createAction<AddChatPayload>(`${type}/addChat`);

export interface RemoveChatPayload {
  groupId: ID;
}

export const removeChat = createAction<RemoveChatPayload>(`${type}/removeChat`);

export interface IncreaseParticipantsPayload {
  groupId: ID;
}

export const increaseParticipants = createAction<IncreaseParticipantsPayload>(`${type}/increaseParticipants`);

export interface DecreaseParticipantsPayload {
  groupId: ID;
}

export const decreaseParticipants = createAction<DecreaseParticipantsPayload>(`${type}/decreaseParticipants`);

export interface ChangeMemberPayload {
  groupId: ID;
  member: GroupMember;
}

export const changeMember = createAction<ChangeMemberPayload>(`${type}/changeMember`);
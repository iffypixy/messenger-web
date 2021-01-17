import {createAction, createAsyncThunk} from "@reduxjs/toolkit";

import {Discussion, DiscussionsListItem, ID, Message} from "@api/common";
import {
  CreateDiscussionData,
  CreateMessageData,
  discussionApi,
  GetDiscussionData,
  GetMessagesData
} from "@api/discussion.api";

const typePrefix = "chat/discussions";

export const fetchDiscussions = createAsyncThunk<{discussions: DiscussionsListItem[]}>(`${typePrefix}/fetchDiscussions`, async () => {
  const {data} = await discussionApi.getDiscussions();

  return data;
});

export const fetchDiscussion = createAsyncThunk<{discussion: Discussion}, GetDiscussionData>(`${typePrefix}/fetchDiscussion`, async (args) => {
  const {data} = await discussionApi.getDiscussion(args);

  return data;
});

export const fetchCreateMessage = createAsyncThunk<{message: Message}, CreateMessageData>(`${typePrefix}/fetchCreateMessage`, async (args) => {
  const {data} = await discussionApi.createMessage(args);

  return data;
});

export const fetchMessages = createAsyncThunk<{messages: Message[]}, GetMessagesData>(`${typePrefix}/fetchMessages`, async (args) => {
  const {data} = await discussionApi.getMessages(args);

  return data;
});

export const fetchCreateDiscussion = createAsyncThunk<{discussion: Discussion}, CreateDiscussionData>(`${typePrefix}/fetchCreateDiscussion`, async (args) => {
  const {data} = await discussionApi.createDiscussion(args);

  return data;
});

export const setDiscussionId = createAction<{id: ID}>(`${typePrefix}/setDiscussionId`);
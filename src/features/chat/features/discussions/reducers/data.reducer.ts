import {createReducer, PayloadAction, Reducer} from "@reduxjs/toolkit";

import {ChatMemberStatus} from "@features/chat";
import {Discussion, DiscussionsListItem, ID, Message, User} from "@api/common";
import * as actions from "../actions";

interface ExtendedDiscussionsListItem extends DiscussionsListItem {
  members: (User & {status: ChatMemberStatus})[];
}

interface DiscussionChat extends Discussion {
  members: (User & {status: ChatMemberStatus})[];
  messages: Message[];
  areAllMessagesFetched: boolean;
}

interface InitialState {
  currentDiscussionId: ID | null;
  list: ExtendedDiscussionsListItem[] | null;
  discussions: {
    [key: string]: DiscussionChat;
  }
}

const emptyDiscussion = {
  areAllMessagesFetched: false,
  members: [],
  messages: []
};

export const dataReducer: Reducer<InitialState> = createReducer<InitialState>(
  {
    list: null,
    discussions: {},
    currentDiscussionId: null
  },
  {
    [actions.fetchDiscussions.fulfilled.type]: (state, {payload}: PayloadAction<{discussions: DiscussionsListItem[]}>) => {
      state.list = payload.discussions.map((discussion) => ({
        ...discussion,
        members: discussion.members.map((member) => ({...member, status: null}))
      }));
    },

    [actions.fetchDiscussion.fulfilled.type]: (state, {payload}: PayloadAction<{discussion: Discussion}>) => {
      const discussion = state.discussions[state.currentDiscussionId!] || emptyDiscussion;

      state.discussions[state.currentDiscussionId!] = {
        ...discussion, ...payload.discussion,
        members: payload.discussion.members.map((member) => ({...member, status: null}))
      };
    },

    [actions.fetchMessages.fulfilled.type]: (state, {payload}: PayloadAction<{messages: Message[]}>) => {
      const discussion = state.discussions[state.currentDiscussionId!] || emptyDiscussion;

      state.discussions[state.currentDiscussionId!] = {
        ...discussion, messages: [...discussion.messages, ...payload.messages]
      };
    },

    [actions.fetchCreateDiscussion.fulfilled.type]: (state, {payload}: PayloadAction<{discussion: Discussion}>) => {
      const item: ExtendedDiscussionsListItem = {
        ...payload.discussion,
        members: payload.discussion.members.map((member) => ({...member, status: null})),
        lastMessage: null, unreadMessagesNumber: 0
      };

      state.list = state.list ? [...state.list, item] : [item];

      state.discussions[payload.discussion.id] = {
        ...payload.discussion,
        members: payload.discussion.members.map((member) => ({...member, status: null})),
        areAllMessagesFetched: false,
        messages: []
      };
    },

    [actions.setDiscussionId.type]: (state, {payload}: PayloadAction<{id: ID}>) => {
      state.currentDiscussionId = payload.id;
    }
  }
);
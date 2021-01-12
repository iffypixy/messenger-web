import {AxiosPromise} from "axios";

import {request, RequestQuery} from "@lib/request";
import {Discussion, DiscussionsListItem, ID, Message, MessageData} from "./common";

export interface CreateDiscussionData {
  membersIds: ID[];
  title: string;
  avatar: Blob;
}

const createDiscussion = ({avatar, membersIds, title}: CreateDiscussionData): AxiosPromise<{discussion: Discussion}> => {
  const formData = new FormData();

  membersIds.forEach((id) => {
    formData.append("membersIds[]", id);
  });

  formData.append("title", title);
  formData.append("avatar", avatar);

  return request({
    method: "POST",
    url: "/api/discussions",
    data: formData,
    withCredentials: true
  });
};

const getDiscussions = (): AxiosPromise<{discussions: DiscussionsListItem[]}> => request({
  method: "GET",
  url: "/api/discussions",
  withCredentials: true
});

export interface GetMessagesData extends RequestQuery {
  discussionId: ID;
}

const getMessages = ({discussionId, limit, skip}: GetMessagesData): AxiosPromise<{messages: Message[]}> => request({
  method: "GET",
  url: `/api/discussions/${discussionId}/messages`,
  params: {limit, skip}
});

export interface CreateMessageData {
  discussionId: ID;
  message: MessageData;
}

const createMessage = ({discussionId, message}: CreateMessageData): AxiosPromise<{message: Message}> => request({
  method: "POST",
  url: `/api/discussions/${discussionId}/messages`,
  data: message
});

export interface GetDiscussionData {
  discussionId: ID;
}

const getDiscussion = ({discussionId}: GetDiscussionData): AxiosPromise<{discussion: Discussion}> => request({
  method: "GET",
  url: `/api/discussions/${discussionId}`,
  withCredentials: true
});

export const discussionApi = {
  createDiscussion, getDiscussions,
  createMessage, getMessages,
  getDiscussion
};
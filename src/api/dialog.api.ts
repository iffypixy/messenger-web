import {AxiosPromise} from "axios";

import {request} from "@lib/request";
import {User} from "./auth.api";
import {RequestQuery} from "@lib/interfaces";

export interface Attachment {
  audio: string | null;
  images: string[] | null;
}

export interface Message {
  id: number;
  sender: User;
  text: string | null;
  attachment: Attachment;
  createdAt: Date;
}

const getDialogs = ({
  skip,
  take
}: RequestQuery): AxiosPromise<{dialogs: Dialog[]}> =>
  request({
    url: "/dialogs",
    method: "GET",
    params: {skip, take},
    withCredentials: true
  });

export interface GetMessagesData extends RequestQuery {
  companionId: number;
}

const getMessages = ({companionId, take, skip}: GetMessagesData) =>
  request({
    url: `/dialogs/${companionId}/messages`,
    method: "GET",
    params: {take, skip},
    withCredentials: true
  });

interface MessageData {
  sender: User;
  text: string | null;
  attachment: Attachment;
  createdAt: Date;
}

export interface CreateMessageData {
  companionId: number;
  message: MessageData;
}

const createMessage = ({
  companionId,
  message
}: CreateMessageData): AxiosPromise<{message: Message}> =>
  request({
    url: `/dialogs/${companionId}/messages`,
    method: "POST",
    data: message
  });

export interface GetDialogData {
  companionId: number;
}

export interface Dialog {
  id: number;
  companion: User;
  messages?: Message[];
  latestMessage?: Message;
}

const getDialog = ({
  companionId
}: GetDialogData): AxiosPromise<{dialog: Dialog}> =>
  request({
    url: `/dialogs/${companionId}`,
    method: "GET",
    withCredentials: true
  });

export const dialogApi = {
  getDialogs,
  getMessages,
  createMessage,
  getDialog
};

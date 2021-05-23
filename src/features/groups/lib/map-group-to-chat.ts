import {ChatsListItem} from "@features/chats";
import {GroupChatsListItem} from "./typings";

export const mapGroupToChat = ({chat, lastMessage, numberOfUnreadMessages}: GroupChatsListItem): ChatsListItem => ({
  id: chat.id,
  avatar: chat.avatar,
  name: chat.title,
  message: `${lastMessage && (lastMessage.text || "Attachments")}`,
  date: lastMessage && new Date(lastMessage.createdAt),
  numberOfUnreadMessages
});
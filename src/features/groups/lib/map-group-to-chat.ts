import {ChatsListItem} from "@features/chats";
import {GroupChatsListItem} from "./typings";

export const mapGroupToChat = ({id, title, avatar, lastMessage, numberOfUnreadMessages}: GroupChatsListItem): ChatsListItem => ({
  id, avatar,
  name: title,
  message: `${lastMessage && (lastMessage.text || "Attachments")}`,
  date: lastMessage && new Date(lastMessage.createdAt),
  unreadMessages: numberOfUnreadMessages,
  link: `/group/${id}`
});
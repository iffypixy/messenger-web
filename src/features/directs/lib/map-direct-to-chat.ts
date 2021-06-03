import {ChatsListItem} from "@features/chats"
import {DirectChatsListItem} from "./typings";

export const mapDirectToChat = ({lastMessage, partner, chat, numberOfUnreadMessages}: DirectChatsListItem): ChatsListItem => ({
  id: chat.id,
  name: partner.username,
  avatar: partner.avatar,
  message: `${lastMessage && (lastMessage.text || "Attachments")}`,
  date: lastMessage && new Date(lastMessage.createdAt),
  unreadMessages: numberOfUnreadMessages,
  link: `/direct/${partner.id}`
});
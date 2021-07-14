const prefix = "GROUP_CHAT";

export const serverEvents = {
  MESSAGE: `${prefix}:MESSAGE`,
  MESSAGE_READ: `${prefix}:MESSAGE_READ`,
  CHAT_CREATED: `${prefix}:CHAT_CREATED`,
  MEMBER_ADDED: `${prefix}:MEMBER_ADDED`,
  MEMBER_KICKED: `${prefix}:MEMBER_KICKED`,
  MEMBER_LEFT: `${prefix}:MEMBER_LEFT`,
  ADDED: `${prefix}:ADDED`,
  KICKED: `${prefix}:KICKED`,
  OWNER_REPLACEMENT: `${prefix}:OWNER_REPLACEMENT`,
};
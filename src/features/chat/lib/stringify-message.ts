import {IMessage} from "@api/common";

export function stringifyMessage(message: IMessage): string {
  return message.text ? message.text
    : message.attachments?.files ? "Files"
      : message.attachments?.images ? "Images"
        : message?.attachments?.audio ? "Audio"
          : "";
}

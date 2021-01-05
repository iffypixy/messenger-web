import {IMessage} from "@api/common";

export function stringifyMessage({text, attachments}: IMessage): string {
  return text ? text
    : attachments?.files ? "Files"
      : attachments?.images ? "Images"
        : attachments?.audio ? "Audio"
          : "";
}

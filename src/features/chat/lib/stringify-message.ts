import {Message} from "@api/common";

export function stringifyMessage({text, attachment}: Message): string {
  return text ? text
    : attachment?.files ? "Files"
      : attachment?.images ? "Images"
        : attachment?.audio ? "Audio"
          : "";
}

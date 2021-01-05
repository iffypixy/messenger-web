import React from "react";
import {Picker, PickerProps} from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

export const EmojiPicker: React.FC<PickerProps> = ({onSelect}) => (
  <Picker
    set="apple"
    theme="dark"
    showSkinTones={false}
    showPreview={false}
    sheetSize={32}
    emojiSize={22}
    onSelect={onSelect}
  />
);

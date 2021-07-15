import React from "react";
import {Picker, BaseEmoji} from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import styled from "styled-components";

export interface EmojiPickerProps {
  onSelect: (emoji: BaseEmoji) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({onSelect}) => (
  <Wrapper>
    <Picker
      set="apple"
      theme="dark"
      showSkinTones={false}
      showPreview={false}
      sheetSize={32}
      emojiSize={22}
      onSelect={onSelect}
    />
  </Wrapper>
);

const Wrapper = styled.div`
  .emoji-mart {
    font-size: 1.4rem;
    font-family: ${({theme}) => theme.typography.fontFamily};
  }
`;
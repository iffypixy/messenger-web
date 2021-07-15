import React, {useEffect} from "react";
import styled from "styled-components";
import {Picker, BaseEmoji} from "emoji-mart/dist-es";
import "emoji-mart/css/emoji-mart.css";

export interface EmojiPickerProps {
  onSelect: (emoji: BaseEmoji) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({onSelect}) => {
  useEffect(() => {
    const search = document.getElementsByClassName("emoji-mart-search")[0];

    search.remove();
  }, []);

  return (
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
};

const Wrapper = styled.div`
  .emoji-mart {
    font-size: 1.4rem;
    font-family: ${({theme}) => theme.typography.fontFamily};
  }
`;
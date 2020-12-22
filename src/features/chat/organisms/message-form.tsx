import React, {useState} from "react";
import styled from "styled-components";
import {BaseEmoji} from "emoji-mart";

import {Icon, Input, IconButton, Button} from "@ui/atoms";
import {useActions} from "@lib/hooks";
import {chatDialogsActions} from "@features/chat/features/dialogs";
import {uploadApi} from "@api/upload.api";
import {S3_URL} from "@lib/constants";
import {EmojiPicker} from "./emoji-picker";

export const MessageForm: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [attachments, setAttachments] = useState([]);

  const {fetchCreateMessage} = useActions(chatDialogsActions);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetchCreateMessage({text});
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files![0];
    
    const formData = new FormData();

    formData.append("file", file);

    uploadApi.upload(formData);
  };

  return (
    <Wrapper>
      <Form onSubmit={onFormSubmit}>
        <FormBlock>
          <Input
            type="file"
            accept="image/*"
            label={
              <Icon
                role="button"
                cursor="pointer"
                gray={true}
                name="attachment"
              />
            }
            name="images"
            onChange={handleFileInputChange}
            hidden
          />

          <EmojiWrapper>
            <Icon name="smile" gray role="button" />
            <EmojiPickerWrapper>
              <EmojiPicker
                onSelect={(emoji: BaseEmoji) =>
                  setText((text) => `${text}${emoji.native}`)
                }
              />
            </EmojiPickerWrapper>
          </EmojiWrapper>
        </FormBlock>

        <InputWrapper>
          <Input
            value={text}
            name="text"
            type="text"
            width="100%"
            transparent
            placeholder="Write something..."
            onChange={({currentTarget}) => setText(currentTarget.value)}
          />
        </InputWrapper>

        <FormBlock>
          <IconButton>
            <Icon name="microphone" gray />
          </IconButton>

          <SubmitButton>
            <Icon name="telegram" />
          </SubmitButton>
        </FormBlock>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  border-top: 2px solid ${({theme}) => theme.palette.divider};
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
`;

const FormBlock = styled.div`
  display: flex;
  align-items: center;

  & > :not(:first-child) {
    margin-left: 2rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  margin: 0 2rem;
`;

const SubmitButton = styled(Button)`
  border-radius: 50%;
  padding: 1rem;
`;

const EmojiWrapper = styled.div`
  position: relative;
  cursor: pointer;

  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const EmojiPickerWrapper = styled.div`
  visibility: hidden;
  position: absolute;
  left: 2rem;
  bottom: 3.5rem;
  transition: 0.2s visibility linear, 0.2s opacity linear;
  opacity: 0;

  & > section {
    font-size: 1.4rem;
    font-family: ${({theme}) => theme.typography.fontFamily};
  }
`;

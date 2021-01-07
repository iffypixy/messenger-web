import React, {useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {nanoid} from "nanoid";
import {unwrapResult} from "@reduxjs/toolkit";
import {BaseEmoji} from "emoji-mart";

import {authSelectors} from "@features/auth";
import {useActions} from "@lib/hooks";
import {socket} from "@lib/socket";
import {Input, Button, Icon} from "@ui/atoms";
import {EmojiPicker} from "@ui/organisms";
import {ID, IMessage} from "@api/common";
import {uploadApi} from "@api/upload.api";
import * as actions from "../actions";
import * as selectors from "../selectors";

export const DialogForm: React.FC = () => {
  const [text, setText] = useState<string>("");

  const credentials = useSelector(authSelectors.credentialsSelector);
  const dialog = useSelector(selectors.dialogSelector);

  const {companionId} = useParams<{companionId: ID}>();

  const {fetchCreateMessage, addMessage, updateMessage} = useActions(actions);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!dialog?.companion || !text) return;

    const id = nanoid();

    addMessage({
      message: {
        id, sender: credentials, isRead: false,
        createdAt: new Date().toISOString(), text
      }
    });

    fetchCreateMessage({companionId, message: {text}})
      .then(unwrapResult)
      .then(({message}: {message: IMessage}) => {
          updateMessage({companionId, messageId: id, updatedMessage: message});

          socket.emit("message", {recipientId: companionId, message});
        }
      )
      .catch(() => null);

    setText("");
  };

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    socket.emit("typing", {recipientId: companionId});

    setText(event.currentTarget.value);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files![0];

    const formData = new FormData();

    formData.append("file", file);

    uploadApi.uploadFile({file: formData});
  };

  return (
    <Wrapper>
      <Form onSubmit={handleFormSubmit}>
        <button type="submit" hidden/>

        <FormBlock>
          <Input
            type="file"
            label={
              <Icon
                role="button"
                type="button"
                cursor="pointer"
                name="attachment"
                secondary
              />
            }
            name="files"
            onChange={handleFileInputChange}
            hidden
          />

          <Input
            type="file"
            label={
              <Icon
                role="button"
                type="button"
                cursor="pointer"
                name="picture"
                secondary
              />
            }
            name="images"
            accept="image/*"
            onChange={handleFileInputChange}
            hidden
          />

          <EmojiWrapper>
            <Icon name="smile" secondary/>
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
            onChange={handleTextInputChange}
          />
        </InputWrapper>

        <FormBlock>
          <Button type="button" pure>
            <Icon name="microphone" secondary role="button" type="button"/>
          </Button>

          <SubmitButton type="submit">
            <Icon name="telegram"/>
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
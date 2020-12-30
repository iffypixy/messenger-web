import React, {useEffect, useState, useRef} from "react";
import {useParams, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import styled from "styled-components";
import format from "date-fns/format";
import {BaseEmoji} from "emoji-mart";
import {PayloadAction} from "@reduxjs/toolkit";

import {authSelectors} from "@features/auth";
import {ChatTemplate, Message, EmojiPicker, chatActions} from "@features/chat";
import {UserName} from "@features/user";
import {chatDialogsActions, chatDialogsSelectors} from "@features/chat/features/dialogs";
import {Avatar, Text, IconButton, Icon, Button, Input} from "@ui/atoms";
import {useActions} from "@lib/hooks";
import {socket} from "@lib/socket";
import {isElementVisible} from "@lib/dom";
import {IMessage} from "@api/dialog.api";
import {uploadApi} from "@api/upload.api";

export const ViewPage: React.FC = () => {
  const credentials = useSelector(authSelectors.credentialsSelector);

  const {fetchCompanion, fetchMessages, setCurrentCompanionId, fetchDialogs} = useActions(chatDialogsActions);

  const {companionId} = useParams<{companionId: string}>();

  const history = useHistory();

  useEffect(() => {
    setCurrentCompanionId(companionId);
  }, [companionId]);

  useEffect(() => {
    if (companionId === credentials!.id) history.push("/");

    fetchDialogs({skip: 0, take: 5});
    fetchCompanion(companionId);
    fetchMessages({companionId, take: 9999, skip: 0});
  }, []);

  return (
    <ChatTemplate>
      <ChatHeader />
      <MessagesList />
      <MessageForm />
    </ChatTemplate>
  );
};

const ChatHeader: React.FC = () => {
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);

  const companion = dialog?.companion;

  return (
    <Header>
      <HeaderInfo>
        <HeaderAvatar>
          <Avatar src={companion?.avatar} />
        </HeaderAvatar>

        <HeaderContent>
          <UserName>{companion?.firstName}</UserName>
          <Text>Online/offline</Text>
        </HeaderContent>
      </HeaderInfo>

      <HeaderOptions>
        <IconButton>
          <Icon name="loupe" />
        </IconButton>

        <IconButton>
          <Icon name="attachment" />
        </IconButton>
      </HeaderOptions>
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 2px solid ${({theme}) => theme.palette.divider};
  padding: 2rem;
`;

const HeaderInfo = styled.div`
  display: flex;
`;

const HeaderAvatar = styled.div`
  width: 65px;
  height: 65px;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0 1rem 1.5rem;
`;

const HeaderOptions = styled.div`
  display: flex;
  align-items: center;

  & > :not(:first-child) {
    margin-left: 3rem;
  }
`;

const MessagesList: React.FC = () => {
  const [isInitiallyScrolled, setIsInitiallyScrolled] = useState(false);

  const credentials = useSelector(authSelectors.credentialsSelector);
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);

  const {fetchReadMessages, setMessagesRead} = useActions({...chatDialogsActions, ...chatActions});

  const listRef = useRef<HTMLDivElement>(null);

  const messages = dialog?.messages;

  const readMessages = (element: HTMLElement) => {
    const elements = (Array.from(
      element.children
    ) as HTMLElement[]).filter(
      (elem) => elem.dataset.own === "false" && elem.dataset.read === "false"
    );

    const idx = [...elements]
      .reverse()
      .findIndex((elem) => isElementVisible(elem));

    if (idx === -1) return;

    const ids = elements
      .slice(0, elements.length - idx)
      .map((elem) => elem.dataset.id);

    if (ids.length) {
      setMessagesRead(ids);

      fetchReadMessages(ids);
    }
  };

  useEffect(() => {
    if (!messages) return;

    const list = listRef.current;

    if (!isInitiallyScrolled) {
      list!.scrollTop = list!.scrollHeight;

      readMessages(list!);

      setIsInitiallyScrolled(true);
    } else {
      const msg = messages[messages.length - 1];

      if (msg && msg.sender.id === credentials!.id) {
        list!.scrollTop = list!.scrollHeight;
      } else {
        const diff = list!.scrollHeight - list!.scrollTop;

        if (diff < 1250) list!.scrollTop = list!.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <List ref={listRef} onScroll={(event) => readMessages(event.currentTarget)}>
      {messages &&
        messages.map((msg, idx) => {
          const previous = messages[idx - 1];

          const isNewDay =
            idx === 0 ||
            (previous &&
              +new Date(previous.createdAt).getDay() !==
                +new Date(msg.createdAt).getDay());

          return (
            <React.Fragment key={msg.id || idx}>
              {isNewDay && (
                <NewDayBlock>
                  <ListLine />
                  <Text>{format(new Date(msg.createdAt), "dd LLLL")}</Text>
                  <ListLine />
                </NewDayBlock>
              )}

              <Message
                id={msg.id}
                own={credentials!.id === msg.sender.id}
                text={msg.text}
                sender={msg.sender}
                createdAt={msg.createdAt}
                read={msg.isRead}
              />
            </React.Fragment>
          );
        })}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow-y: scroll;
  padding: 2rem 3.5rem 4rem;

  & > :not(:first-child) {
    margin-top: 2rem;
  }
`;

const NewDayBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 2rem 0;
`;

const ListLine = styled.div`
  width: 40%;
  height: 2px;
  background-color: ${({theme}) => theme.palette.primary.main};
`;

const MessageForm: React.FC = () => {
  const [text, setText] = useState<string>("");

  const credentials = useSelector(authSelectors.credentialsSelector);
  const dialog = useSelector(chatDialogsSelectors.dialogSelector);

  const {companionId} = useParams<{companionId: string}>();

  const {fetchCreateMessage, addMessage} = useActions(chatDialogsActions);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!text) return;

    addMessage({
      companion: dialog.companion,
      message: {
        sender: credentials, text,
        createdAt: new Date()
      }
    });

    fetchCreateMessage({companionId, message: {text}}).then(
      ({payload}: PayloadAction<{message: IMessage}>) => {
        if (payload) {
          socket.emit("message", {
            recipientId: companionId,
            message: payload.message
          });
        }
      }
    );

    setText("");
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
      <Form onSubmit={handleFormSubmit}>
        <button type="submit" hidden />

        <FormBlock>
          <Input
            type="file"
            label={
              <Icon
                role="button"
                type="button"
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
            <Icon name="smile" gray />
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
          <IconButton type="button">
            <Icon name="microphone" gray role="button" type="button" />
          </IconButton>

          <SubmitButton type="submit">
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
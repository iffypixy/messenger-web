import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import {nanoid} from "nanoid";
import prettyBytes from "pretty-bytes";

import {authSelectors} from "@features/auth";
import {ChatsList, Message, SystemMessage, UploadingFile, formatMessageDate} from "@features/chats";
import {directsSelectors, directsActions} from "@features/directs";
import {groupsSelectors} from "@features/groups";
import {uploadApi} from "@api/upload.api";
import {Col, Row} from "@lib/layout";
import {formatDuration} from "@lib/formatting";
import {ID} from "@lib/typings";
import {stopMediaStream} from "@lib/media-recorder";
import {MainTemplate} from "@ui/templates";
import {H2, H4, Icon, Input, Text, Button, Loader} from "@ui/atoms";
import {Avatar, ProgressBar} from "@ui/molecules";

export const DirectPage = () => {
  const dispatch = useDispatch();

  const directChats = useSelector(directsSelectors.chats);
  const areDirectChatsFetching = useSelector(directsSelectors.areChatsFetching);

  const groupChats = useSelector(groupsSelectors.chats);
  const areGroupChatsFetching = useSelector(groupsSelectors.areChatsFetching);

  const toFetchDirectChats = !directChats && !areDirectChatsFetching;
  const toFetchGroupChats = !groupChats && !areGroupChatsFetching;

  useEffect(() => {
    if (toFetchDirectChats) dispatch(directsActions.fetchChats());
    if (toFetchGroupChats) dispatch(directsActions.fetchChats());
  }, []);

  const {partnerId} = useParams<{partnerId: ID}>();

  const directChat = useSelector(directsSelectors.chat);
  const isDirectChatFetching = useSelector(directsSelectors.isChatFetching);

  const toFetchDirectChat = !directChat && !isDirectChatFetching;

  const directMessages = useSelector(directsSelectors.messages);
  const areDirectMessagesFetching = useSelector(directsSelectors.areMessagesFetching);

  const toFetchDirectMessages = !directMessages && !areDirectMessagesFetching;

  useEffect(() => {
    if (toFetchDirectChat) {
      dispatch(directsActions.fetchChat({
        partner: partnerId
      }));
    }

    if (toFetchDirectMessages) {
      dispatch(directsActions.fetchMessages({
        partner: partnerId,
        skip: "0" as unknown as number
      }));
    }
  }, []);

  return (
    <MainTemplate>
      <Wrapper>
        <SidebarWrapper>
          <Sidebar>
            <Icon name="logo"/>
          </Sidebar>
        </SidebarWrapper>

        <ListPanelWrapper>
          <Col gap="3rem">
            <Row justify="space-between">
              <H4>Messages</H4>
              <Text clickable secondary>
                + Create new chat
              </Text>
            </Row>

            <SearchBar/>
          </Col>

          <ChatsList/>
        </ListPanelWrapper>

        <ChatPanelWrapper>
          <DirectChat/>
        </ChatPanelWrapper>
      </Wrapper>
    </MainTemplate>
  );
};

const SearchBar: React.FC = () => {
  const [text, setText] = useState("");

  return (
    <Input placeholder="Search chat"
           onChange={({currentTarget}) => setText(currentTarget.value)}
           value={text}/>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  background-color: ${({theme}) => theme.palette.primary.main};
`;

const SidebarWrapper = styled.aside`
  width: 10%;
  padding: 3rem 0 3rem 2rem;
`;

const Sidebar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
  padding: 3rem 0;
`;

const ListPanelWrapper = styled(Col).attrs(() => ({
  gap: "3rem"
}))`
  width: 30%;
  height: 100%;
  padding: 4rem;
`;

const ChatPanelWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 100%;
  border-left: 2px solid ${({theme}) => theme.palette.divider};
`;

const DirectChat: React.FC = () => {
  const chat = useSelector(directsSelectors.chat);
  const isFetching = useSelector(directsSelectors.isChatFetching);
  const messages = useSelector(directsSelectors.messages);
  const areMessagesFetching = useSelector(directsSelectors.areMessagesFetching);
  const credentials = useSelector(authSelectors.credentials)!;

  if (isFetching) return <H4>Loading...</H4>;

  if (!chat) return null;

  return (
    <Col width="100%" height="100%">
      <Header>
        <Row width="100%" height="100%" justify="space-between" align="center">
          <Row height="100%" gap="3rem" align="center">
            <Avatar url={chat.partner.avatar}/>

            <Col height="100%" justify="space-between" padding="1rem 0">
              <H4>{chat.partner.username}</H4>
              <Text small>Last seen at {formatMessageDate(new Date(chat.partner.lastSeen))}</Text>
            </Col>
          </Row>

          <Row gap="3rem">
            <Icon name="loupe" pointer/>
            <Icon name="options" pointer/>
          </Row>
        </Row>
      </Header>

      <MessagesList>
        {areMessagesFetching && <H2>Loading...</H2>}

        {messages && messages.map(({id, isSystem, text, sender, createdAt, isRead, images, audio, files}) => {
          if (isSystem) return (
            <SystemMessage
              key={id}
              text={text}
              date={new Date(createdAt)}/>
          );

          const isOwn = !!(sender && sender.id === credentials.id);

          return (
            <Message
              key={id}
              text={text}
              images={images}
              audio={audio}
              files={files}
              avatar={sender!.avatar}
              date={new Date(createdAt)}
              isOwn={isOwn}
              isRead={isRead}/>
          );
        })}
      </MessagesList>

      <DirectForm/>
    </Col>
  );
};

const Header = styled(Row).attrs(() => ({
  width: "100%",
  align: "center",
  padding: "3rem 4.5rem"
}))`
  border-bottom: 2px solid ${({theme}) => theme.palette.divider};
`;

const MessagesList = styled(Col).attrs(() => ({
  width: "100%",
  padding: "1rem 5rem"
}))`
  flex: 1;
  overflow: auto;
`;

interface DirectChatFormInputs {
  images: UploadingFile[];
  files: UploadingFile[];
  audio: ID;
  text: string;
}

interface DirectChatRecording {
  isRecording: boolean;
  isUploading: boolean;
  mediaRecorder: MediaRecorder | null;
  duration: number;
}

const DirectForm: React.FC = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState<DirectChatFormInputs>({
    audio: "", files: [],
    images: [], text: ""
  });

  const [audio, setAudio] = useState<DirectChatRecording>({
    isRecording: false,
    isUploading: false,
    mediaRecorder: null,
    duration: 0
  });

  const chat = useSelector(directsSelectors.chat);

  if (!chat) return null;

  const {text, images, files} = form;

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form, text: event.currentTarget.value
    });
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files && event.currentTarget.files[0];

    if (!file) return;

    const key = nanoid();

    setForm({
      ...form, files: [...files, {
        key, isUploading: true, progress: 0,
        name: file.name
      }]
    });

    uploadApi.upload({file}, {
      onUploadProgress: ({loaded, total}) => {
        setForm((form) => ({
          ...form, files: form.files.map((file) => file.key === key ?
            ({...file, progress: loaded / total}) : file)
        }));
      }
    }).then(({data}) => {
      setForm((form) => ({
        ...form, files: form.files.map((file) => file.key === key ? ({
          ...file,
          id: data.file.id,
          size: data.file.size,
          url: data.file.url,
          isUploading: false,
          progress: 1
        }) : file)
      }));
    }).catch(() => {
      setForm((form) => ({
        ...form, files: form.files.filter((file) => file.key !== key)
      }));
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files && event.currentTarget.files[0];

    if (!file) return;

    const key = nanoid();

    setForm({
      ...form,
      images: [...images, {
        key, progress: 0, isUploading: true,
        name: file.name
      }]
    });

    uploadApi.upload({file}, {
      onUploadProgress: ({loaded, total}) => {
        setForm((form) => ({
          ...form, images: form.images.map((image) => image.key === key ?
            ({...image, progress: loaded / total}) : image)
        }));
      }
    }).then(({data: {file}}) => {
      setForm((form) => ({
        ...form, images: form.images.map((image) => image.key === key ? ({
          ...image,
          id: file.id,
          url: file.url,
          size: file.size,
          isUploading: false,
          progress: 1
        }) : image)
      }));
    }).catch(() => {
      setForm((form) => ({
        ...form, images: form.images.filter((image) => image.key !== key)
      }));
    });
  };

  const removeFile = (key: UploadingFile["key"]) => {
    setForm({
      ...form, files: files.filter((file) => file.key !== key)
    });
  };

  const removeImage = (key: UploadingFile["key"]) => {
    setForm({
      ...form, images: images.filter((image) => image.key !== key)
    });
  };

  const attachments: (UploadingFile & {type: string})[] = [
    ...files.map((file) => ({...file, type: "files"})),
    ...images.map(((image) => ({...image, type: "images"})))
  ];

  const startRecording = () => {
    setAudio({
      duration: 0,
      mediaRecorder: null,
      isRecording: false,
      isUploading: false
    });

    navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        setAudio((audio) => ({
          ...audio, mediaRecorder
        }));

        let durationInterval: NodeJS.Timeout | null = null;
        let isCancelled: boolean = false;

        mediaRecorder.onstart = () => {
          setAudio((audio) => ({
            ...audio, isRecording: true
          }));

          durationInterval = setInterval(() => {
            setAudio((audio) => ({
              ...audio, duration: audio.duration + 1000
            }));
          }, 1000);
        };

        mediaRecorder.onstop = () => {
          if (durationInterval) clearInterval(durationInterval);

          stopMediaStream(mediaRecorder.stream);
        };

        mediaRecorder.onpause = () => {
          isCancelled = true;

          stopMediaStream(mediaRecorder.stream);

          setAudio({
            ...audio, isRecording: false
          });
        };

        mediaRecorder.ondataavailable = (event) => {
          if (isCancelled) return;

          setAudio((audio) => ({
            ...audio, isUploading: true
          }));

          uploadApi.upload({
            file: event.data as File
          }).then(({data}) => {
            dispatch(directsActions.fetchSendingMessage({
              audio: data.file.id,
              partner: chat.partner.id
            }));
          }).finally(() => {
            setAudio((audio) => ({
              ...audio,
              isUploading: false,
              isRecording: false
            }));
          });
        };

        mediaRecorder.start();
      });
  };

  const cancelRecording = () => {
    audio.mediaRecorder!.pause();
  };

  const handleAudioFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    audio.mediaRecorder!.stop();
  };

  const handleMessageFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    dispatch(directsActions.fetchSendingMessage({
      partner: chat.partner.id,
      audio: form.audio, text,
      files: files.map(({id}) => id!).filter(Boolean),
      images: images.map(({id}) => id!).filter(Boolean)
    }));
  };

  const handleFormSubmit = audio.isRecording ? handleAudioFormSubmit : handleMessageFormSubmit;

  const areFilesAttached = !!attachments.length;

  return (
    <Row width="100%" padding="2rem 5rem">
      <Form onSubmit={handleFormSubmit}>
        <Col width="100%" gap="2rem">
          {audio.isRecording ? (
            <Row width="100%" justify="space-between" align="center">
              <Icon
                name="cross"
                type="button"
                onClick={cancelRecording}
                pointer secondary/>

              <Text>{formatDuration(Math.ceil(audio.duration))}</Text>

              {audio.isUploading ? <Loader /> : (
                <Button type="submit" pure>
                  <Icon name="telegram"/>
                </Button>
              )}
            </Row>
          ) : (
            <FormPanel>

              <Input
                type="file"
                name="file"
                onChange={handleFilesChange}
                invisible label={(
                <Icon
                  name="attachment"
                  secondary pointer/>
              )}/>

              <Input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                invisible label={(
                <Icon
                  name="uploading-image"
                  secondary pointer/>
              )}/>

              <Icon
                name="smile"
                secondary pointer/>

              <Input
                width="100%"
                placeholder="Write a message..."
                name="message"
                type="text"
                value={text}
                onChange={handleTextChange}
                transparent/>

              <Icon
                onClick={startRecording}
                name="microphone"
                type="button"
                secondary pointer/>

              <Button type="submit" pure>
                <Icon name="telegram"/>
              </Button>
            </FormPanel>
          )}

          {areFilesAttached && (
            <Row width="100%" padding="0 1rem">
              <Col width="100%" gap="1rem">
                {attachments.map(({key, name, size, url, progress, isUploading, type}) => {
                  const remove = () => type === "images" ? removeImage(key) :
                    type === "files" ? removeFile(key) : null;

                  return (
                    <Row key={key} width="100%" justify="space-between" align="center">
                      {isUploading ? (
                        <>
                          <Row width="70%" gap="1rem" align="center">
                            <Row width="60%">
                              <ProgressBar progress={progress}/>
                            </Row>

                            <Text width="40%" ellipsis>{name}</Text>
                          </Row>

                          <Icon
                            onClick={remove}
                            name="cross"
                            type="button"
                            pointer secondary/>
                        </>
                      ) : type === "files" ? (
                        <>
                          <Row width="70%" gap="1rem" align="center">
                            <Icon name="document" width="3rem" height="3rem" secondary/>

                            <Col justify="space-between">
                              <Text secondary ellipsis>{name}</Text>
                              <Text secondary ellipsis>{prettyBytes(size!)}</Text>
                            </Col>
                          </Row>

                          <Icon
                            onClick={remove}
                            name="cross"
                            type="button"
                            pointer secondary/>
                        </>
                      ) : type === "images" ? (
                        <>
                          <Row width="70%">
                            <AttachedImage src={url} alt="attached-image"/>
                          </Row>

                          <Icon
                            onClick={remove}
                            name="cross"
                            type="button"
                            pointer secondary/>
                        </>
                      ) : null}
                    </Row>
                  );
                })}
              </Col>
            </Row>
          )}
        </Col>
      </Form>
    </Row>
  );
};

const Form = styled.form`
  width: 100%;
`;

const FormPanel = styled(Row).attrs(() => ({
  width: "100%",
  align: "center",
  gap: "2rem",
  padding: "1rem 3rem"
}))`
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
`;

const AttachedImage = styled.img`
  max-width: 7.5rem;
  max-height: 7.5rem;
`;
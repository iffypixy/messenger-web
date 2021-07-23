import React, {useState} from "react";
import {nanoid} from "nanoid";
import prettyBytes from "pretty-bytes";
import {BaseEmoji} from "emoji-mart/dist-es";
import styled from "styled-components";

import {uploadsApi} from "@api/uploads.api";
import {stopMediaStream} from "@lib/media-stream";
import {Col, Row} from "@lib/layout";
import {formatDuration} from "@lib/date";
import {EmojiPicker} from "@lib/emoji";
import {File, ID} from "@lib/typings";
import {Button, Icon, Input, Loader, Text, Textarea} from "@ui/atoms";
import {ProgressBar} from "@ui/molecules";

type Attachment = "images" | "files";

interface UploadingFile {
  id?: ID;
  key: string;
  url?: string;
  name?: string;
  size?: number;
  isUploading: boolean;
  progress: number;
}

interface ChatFormProps {
  error: string | null;
  handleSubmit: (options: {
    text: string;
    files: File[] | null;
    audio: {
      id: ID;
      url: string;
    } | null;
    images: {
      id: ID;
      url: string;
    }[] | null;
  }) => void;
}

export const ChatForm: React.FC<ChatFormProps> = ({handleSubmit, error}) => {
  const [form, setForm] = useState<{
    images: UploadingFile[];
    files: UploadingFile[];
    audio: ID;
    text: string;
  }>({
    audio: "", text: "",
    images: [], files: []
  });

  const [audio, setAudio] = useState<{
    isRecording: boolean;
    isUploading: boolean;
    mediaRecorder: MediaRecorder | null;
    duration: number;
  }>({
    isRecording: false,
    isUploading: false,
    mediaRecorder: null,
    duration: 0
  });

  const {text, images, files} = form;

  const removeFile = (key: string) => {
    setForm({
      ...form, files: files.filter((file) => file.key !== key)
    });
  };

  const removeImage = (key: string) => {
    setForm({
      ...form, images: images.filter((image) => image.key !== key)
    });
  };

  const attachments: (UploadingFile & {type: Attachment})[] = [
    ...files.map((file) => ({...file, type: "files" as const})),
    ...images.map(((image) => ({...image, type: "images" as const})))
  ];

  const startRecording = () => {
    setAudio({
      duration: 0,
      mediaRecorder: null,
      isRecording: false,
      isUploading: false
    });

    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
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
            ...audio, duration: audio.duration + 1
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

        const mp3 = new Blob([event.data], {
          type: "audio/mpeg"
        });

        uploadsApi.upload({
          file: mp3 as globalThis.File
        }).then(({data: {file: {id, url}}}) => {
          handleSubmit({
            audio: {id, url},
            text: "",
            images: null,
            files: null
          });
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

  const clearInputs = () => {
    setForm({
      text: "", audio: "",
      files: [], images: []
    });
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({
      ...form, text: event.currentTarget.value
    });
  };

  const handleTextareaKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleMessageFormSubmit();
    }
  };

  const handleEmojiSelect = (emoji: BaseEmoji) => {
    setForm((form) => ({
      ...form,
      text: `${form.text}${emoji.native}`
    }));
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files && event.currentTarget.files[0];

    if (!file) return;

    const key = nanoid();

    setForm({
      ...form, files: [
        ...files, {
          key, isUploading: true,
          progress: 0, name: file.name
        }
      ]
    });

    uploadsApi.upload({file}, {
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

  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files && event.currentTarget.files[0];

    if (!file) return;

    const key = nanoid();

    setForm({
      ...form, images: [
        ...images, {
          key, progress: 0, isUploading: true,
          name: file.name
        }
      ]
    });

    uploadsApi.upload({file}, {
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

  const handleAudioFormSubmit = () => {
    audio.mediaRecorder!.stop();

    clearInputs();
  };

  const handleMessageFormSubmit = () => {
    const attachedImages = images
      .filter(({isUploading}) => !isUploading)
      .map(({id, url}) => ({id: id!, url: url!}));

    const attachedFiles = files
      .filter(({isUploading}) => !isUploading)
      .map(({id, url, name, size}) => ({id: id!, url: url!, name: name!, size: size!}));

    if (!text && !attachedImages.length && !attachedFiles.length) return;

    handleSubmit({
      text, audio: null,
      images: !!attachedImages.length ? attachedImages : null,
      files: !!attachedFiles.length ? attachedFiles : null
    });

    clearInputs();
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (audio.isRecording) handleAudioFormSubmit();
    else handleMessageFormSubmit();
  };

  const areAttachmentsAttached = !!attachments.length;

  if (!!error) return (
    <Row width="100%" padding="2rem 5rem">
      <FormPanel>
        <Row width="100%" justify="center" padding="2rem 0">
          <Text>{error}</Text>
        </Row>
      </FormPanel>
    </Row>
  );

  if (audio.isRecording) return (
    <Row width="100%" padding="2rem 5rem">
      <Form onSubmit={handleFormSubmit}>
        <Col width="100%" gap="2rem">
          <Row width="100%" justify="space-between" align="center">
            <Icon
              name="cross"
              type="button"
              onClick={cancelRecording}
              pointer secondary/>

            <Text>{formatDuration(Math.ceil(audio.duration))}</Text>

            {audio.isUploading ? <Loader/> : (
              <Button type="submit" pure>
                <Icon name="telegram"/>
              </Button>
            )}
          </Row>
        </Col>
      </Form>
    </Row>
  );

  return (
    <Row width="100%" padding="2rem 5rem">
      <Form onSubmit={handleFormSubmit}>
        <Col width="100%" gap="2rem">
          <FormPanel>
            <Input
              type="file"
              name="file"
              onChange={handleFileInputChange}
              invisible label={(
              <Icon
                name="attachment"
                secondary pointer/>
            )}/>

            <Input
              type="file"
              name="image"
              onChange={handleImageInputChange}
              accept="image/*"
              invisible label={(
              <Icon
                name="uploading-image"
                secondary pointer/>
            )}/>

            <EmojiButtonWrapper>
              <Icon
                name="smile"
                secondary pointer/>

              <EmojiPickerWrapper>
                <EmojiPicker onSelect={handleEmojiSelect}/>
              </EmojiPickerWrapper>
            </EmojiButtonWrapper>

            <Textarea
              placeholder="Write a message..."
              name="message"
              value={text}
              onKeyDown={handleTextareaKeydown}
              onChange={handleTextareaChange}/>

            <Icon
              onClick={startRecording}
              name="microphone"
              type="button"
              secondary pointer/>

            <SubmitButton type="submit" pure>
              <Icon name="telegram"/>
            </SubmitButton>
          </FormPanel>

          {areAttachmentsAttached && (
            <Col width="100%" align="center" gap="1rem" padding="0 1rem">
              {attachments.map(({key, name, size, url, progress, isUploading, type}) => {
                const remove = () => type === "images" ? removeImage(key) :
                  type === "files" ? removeFile(key) : null;

                return (
                  <Row key={key} width="60%" justify="space-between" align="center">
                    {isUploading ? (
                      <>
                        <Row width="90%" gap="2rem" align="center">
                          <Row width="70%">
                            <ProgressBar progress={progress * 100}>
                              <div/>
                            </ProgressBar>
                          </Row>

                          <Text width="30%" secondary small ellipsis>{name}</Text>
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
                          <Icon
                            name="document"
                            width="2.5rem"
                            height="2.5rem"
                            secondary/>

                          <Col justify="space-between">
                            <Text small secondary ellipsis>{name}</Text>
                            <Text small secondary ellipsis>{prettyBytes(size!)}</Text>
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
  max-width: 4rem;
  max-height: 4rem;
`;

const SubmitButton = styled(Button)`
  display: inline-flex;
`;

const EmojiButtonWrapper = styled.div`
  display: inline-flex;
  position: relative;
  
  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const EmojiPickerWrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  left: 2rem;
  bottom: 3.5rem;
  transition: 0.1s linear;
`;
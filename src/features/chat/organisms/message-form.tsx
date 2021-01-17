import React, {ChangeEvent, useEffect, useState} from "react";
import styled, {keyframes} from "styled-components";
import {nanoid} from "nanoid";
import {BaseEmoji} from "emoji-mart";
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";
import axios, {Canceler} from "axios";

import {Input, Button, Icon, Text, Loader} from "@ui/atoms";
import {EmojiPicker} from "@ui/organisms";
import {ID, MessageData} from "@api/common";
import {File} from "@api/common";
import {uploadApi} from "@api/upload.api";
import {ProgressBar} from "@ui/molecules";
import {Col, Row} from "@lib/layout";

interface Props {
  handleTextInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: ({text, filesIds, imagesIds, audioId}: MessageData) => void;
}

interface AttachmentInfo {
  id: string;
  progress: number;
  name: string;
  date: number;
  size: number;
}

interface UploadAttachment {
  images: (AttachmentInfo & {data?: {id: ID; url: string}})[];
  audio: File | null;
  files: (AttachmentInfo & {data?: File})[];
}

let recorder: MediaRecorder | null = null;
let timerInterval: number | null = null;
let cancelled = false;

export const MessageForm: React.FC<Props> = (props) => {
  const [text, setText] = useState<string>("");
  const [attachment, setAttachment] = useState<UploadAttachment>({images: [], files: [], audio: null});
  const [audioOptions, setAudioOptions] = useState<{recording: boolean; timer: number; uploading: boolean; cancel: Canceler | null}>({
    recording: false,
    timer: 0,
    uploading: false,
    cancel: null
  });

  useEffect(() => {
    if (recorder) {
      timerInterval = setInterval(() => {
        setAudioOptions((options) => ({...options, timer: options.timer + 100}));
      }, 100);
    } else if (timerInterval) clearInterval(timerInterval);

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [recorder]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const audioId = attachment.audio && (attachment.audio ? attachment.audio.id : null);
    const filesIds = attachment.files.map(({data}) => data && data.id).filter(Boolean) as string[];
    const imagesIds = attachment.images.map(({data}) => data && data.id).filter(Boolean) as string[];

    const isNotEmpty = text || audioId || !!filesIds.length || !!imagesIds.length;

    if (isNotEmpty) {
      props.handleFormSubmit({text, audioId, filesIds, imagesIds});

      setText("");
      setAttachment({images: [], files: [], audio: null});
    }
  };

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleTextInputChange(event);

    setText(event.currentTarget.value);
  };

  const handleMicButtonClick = () => {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream) => {
        recorder = new MediaRecorder(stream);

        recorder.onstart = () => {
          setAudioOptions({
            cancel: null,
            uploading: false,
            recording: true,
            timer: 0
          });

          cancelled = false;
        };

        recorder.onstop = () => {
          setAudioOptions((options) => ({...options, recording: false}));
          recorder = null;
        };

        recorder.ondataavailable = (event) => {
          if (!cancelled) {
            const source = axios.CancelToken.source();

            setAudioOptions((options) => ({...options, uploading: true, cancel: source.cancel}));

            uploadApi.uploadFile({file: event.data}, {cancelToken: source.token})
              .then(({data}) => props.handleFormSubmit({
                audioId: data.file.id, imagesIds: [], filesIds: [], text: ""
              }))
              .catch(() => null)
              .finally(() => setAudioOptions((options) => ({...options, uploading: false})));
          }
        };

        recorder.start();
      })
      .catch(() => null);
  };

  const handleAttachmentChange = (
    file: globalThis.File,
    handleUploadProgress: (event: any) => void,
    handleDownloadProgress: (event: any) => void,
    handleSuccess: (file: File) => void
  ) => {
    uploadApi.uploadFile(
      {file}, {onUploadProgress: handleUploadProgress, onDownloadProgress: handleDownloadProgress}
    )
      .then(({data}) => handleSuccess(data.file));
  };

  const handleFilesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0];

    if (!file) return;

    const id = nanoid();

    handleAttachmentChange(file,
      (event: any) => {
        const percent = Math.floor((event.loaded * 100) / event.total);

        if (percent === 100)
          setAttachment((attachment) => ({
            ...attachment,
            files: [...attachment.files, {
              id, progress: 0,
              name: file.name,
              date: Date.now(),
              size: file.size
            }]
          }));
      },
      (event: any) => {
        const percent = Math.floor((event.loaded * 100) / event.total);

        setAttachment((attachment) => ({
          ...attachment,
          files: attachment.files.map((f) => f.id === id ? ({...f, progress: percent}) : f)
        }));
      },
      (file: File) => {
        setAttachment((attachment) => ({
          ...attachment,
          files: attachment.files.map((f) => f.id === id ? ({...f, data: file}) : f)
        }));
      });
  };

  const handleImagesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0];

    if (!file) return;

    const id = nanoid();

    handleAttachmentChange(file,
      (event: any) => {
        const percent = Math.floor((event.loaded * 100) / event.total);

        if (percent === 100)
          setAttachment((attachment) => ({
            ...attachment,
            images: [...attachment.images, {
              id, progress: 0,
              name: file.name,
              date: Date.now(),
              size: file.size
            }]
          }));
      },
      (event: any) => {
        const percent = Math.floor((event.loaded * 100) / event.total);

        setAttachment((attachment) => ({
          ...attachment,
          images: attachment.images.map((f) => f.id === id ? ({...f, progress: percent}) : f)
        }));
      },
      (file: File) => {
        setAttachment((attachment) => ({
          ...attachment,
          images: attachment.images.map((f) => f.id === id ? ({...f, data: {id: file.id, url: file.url}}) : f)
        }));
      });
  };

  const stopRecording = () => {
    if (recorder) recorder.stop();
  };

  const handleStopAudioButtonClick = () => {
    cancelled = true;

    stopRecording();
    if (audioOptions.cancel) audioOptions.cancel();
  };

  const areAttachmentsExist = attachment.audio || !!attachment.files.length || !!attachment.images.length;

  const isRecording = audioOptions.recording || audioOptions.uploading;

  return (
    <Wrapper>
      {isRecording && (
        <Row width="100%" align="center" justify="space-between">
          <Icon
            role="button" name="cross" type="button"
            cursor="pointer" secondary width="1.4rem" height="1.4rem" onClick={handleStopAudioButtonClick}/>

          <Row gap="1.2rem" align="center">
            <DecayCircle/>

            <Row width="8rem" justify="center">
              <Text>{prettyMs(audioOptions.timer, {colonNotation: true})}</Text>
            </Row>
          </Row>

          {audioOptions.uploading ? (
            <Loader name="interwind" secondary/>
          ) : (
            <SubmitButton type="submit" onClick={stopRecording}>
              <Icon name="telegram"/>
            </SubmitButton>
          )}
        </Row>
      )}

      {!isRecording && (
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
              onChange={handleFilesInputChange}
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
              onChange={handleImagesInputChange}
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
            <Button onClick={handleMicButtonClick} type="button" pure>
              <Icon name="microphone" secondary role="button" type="button"/>
            </Button>

            <SubmitButton type="submit">
              <Icon name="telegram"/>
            </SubmitButton>
          </FormBlock>
        </Form>
      )}

      {areAttachmentsExist && <Footer gap="0.2rem">
        {[...attachment.images.map((img) => ({
          ...img, handleDelete: () => setAttachment((attachment) =>
            ({...attachment, images: attachment.images.filter(({id}) => img.id !== id)}))
        })),
          ...attachment.files.map((file) => ({
            ...file, handleDelete: () => setAttachment((attachment) =>
              ({...attachment, files: attachment.files.filter(({id}) => file.id !== id)}))
          }))]
          .map(({id, progress, name, size, data, handleDelete}) => (
            <UploadingAttachment key={id}>
              <Icon name="document" secondary/>

              <UploadingAttachmentContent gap="0.8rem">
                <Row width="100%" justify="space-between">
                  <Row width="60%">
                    <Text space="nowrap" small>{name}</Text>
                  </Row>
                  {progress < 100 && <Text small>{progress}%</Text>}
                </Row>

                {data ? <Text small>{prettyBytes(size)}</Text> : (
                  <ProgressBarWrapper>
                    <ProgressBar progress={progress}/>
                  </ProgressBarWrapper>
                )}
              </UploadingAttachmentContent>

              <AttachmentToolIconWrapper onClick={handleDelete}>
                <Icon name="cross" secondary/>
              </AttachmentToolIconWrapper>
            </UploadingAttachment>
          ))}
      </Footer>}
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

const DecayCircle = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${({theme}) => theme.palette.error.main};
  animation: ${keyframes`
    0% {
      opacity: 1;
    }
    
    50% {
      opacity: 0;
    }
    
    100% {
      opacity: 1;
    }
  `} 1s infinite linear;
`;

const Footer = styled(Col)`
  width: 100%;
  margin-top: 2rem;
`;

const UploadingAttachment = styled.div`
  display: flex;
  align-items: center;
  width: 75%;
  border-radius: 5px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const UploadingAttachmentContent = styled(Col)`
  width: 80%;
  margin: 0 2.5rem;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  margin-right: 2.5rem;
`;

const AttachmentToolIconWrapper = styled.div`
  background-color: ${({theme}) => theme.palette.primary.main};
  border-radius: 50%;
  cursor: pointer;
  padding: 0.6rem;
  margin-left: auto;
  
  > svg {
    width: 1rem;
    height: 1rem;
  }
`;

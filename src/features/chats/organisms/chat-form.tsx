import React, {useState} from "react";
import {nanoid} from "nanoid";
import {useSelector} from "react-redux";
import prettyBytes from "pretty-bytes";
import styled from "styled-components";

import {uploadApi} from "@api/upload.api";
import {UploadingFile} from "@features/chats";
import {directsSelectors} from "@features/directs";
import {stopMediaStream} from "@lib/media-recorder";
import {Col, Row} from "@lib/layout";
import {formatDuration} from "@lib/formatting";
import {ID} from "@lib/typings";
import {Button, Icon, Input, Loader, Text} from "@ui/atoms";
import {ProgressBar} from "@ui/molecules";

interface ChatFormProps {
  handleSubmit: (options: {
    text?: string;
    audio?: ID;
    images?: ID[];
    files?: ID[]
  }) => void;
}

interface ChatFormState {
  images: UploadingFile[];
  files: UploadingFile[];
  audio: ID;
  text: string;
}

interface ChatRecordingState {
  isRecording: boolean;
  isUploading: boolean;
  mediaRecorder: MediaRecorder | null;
  duration: number;
}

export const ChatForm: React.FC<ChatFormProps> = ({handleSubmit}) => {
  const [form, setForm] = useState<ChatFormState>({
    audio: "", files: [],
    images: [], text: ""
  });

  const [audio, setAudio] = useState<ChatRecordingState>({
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

          const mp3 = new Blob([event.data], {
            type: "audio/mpeg"
          });

          uploadApi.upload({
            file: mp3 as File
          }).then(({data}) => {
            handleSubmit({
              audio: data.file.id
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

  const handleAudioFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    audio.mediaRecorder!.stop();
  };

  const handleMessageFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    handleSubmit({
      text, images: images.filter(({id}) => id).map(({id}) => id!),
      files: files.filter(({id}) => id).map(({id}) => id!)
    });
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
import React, {useRef, useState} from "react";
import styled, {css} from "styled-components";
import format from "date-fns/format";
import prettyBytes from "pretty-bytes";

import {SelectableImage} from "@features/chats";
import {File, ID} from "@lib/typings";
import {Col, Row} from "@lib/layout";
import {formatDuration} from "@lib/date";
import {Skeleton} from "@lib/skeleton";
import {Icon, Text} from "@ui/atoms";
import {Avatar} from "@ui/molecules";

interface MessageProps {
  id: ID;
  isOwn: boolean;
  isRead: boolean;
  avatar: string;
  text: string | null;
  images: string[] | null;
  audio: string | null;
  files: File[] | null;
  date: Date;
}

export const Message: React.FC<MessageProps> = ({id, isOwn, isRead, avatar, text, date, images, files, audio: audioSrc}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const [audio, setAudio] = useState<{
    duration: number;
    isPaused: boolean;
    isStarted: boolean;
    time: number;
  }>({
    duration: 0,
    isPaused: true,
    isStarted: false,
    time: 0
  });

  const handleImageLoad = ({currentTarget}: React.SyntheticEvent<HTMLImageElement>) => {
    const parent = messageRef.current!.parentElement!;

    parent.scroll(0, parent.scrollTop + currentTarget.clientHeight);
  };

  const handleAudioDurationChange = ({currentTarget}: React.ChangeEvent<HTMLAudioElement>) => {
    if (currentTarget.duration === Infinity) currentTarget.currentTime = 10e10;

    if (currentTarget.duration !== Infinity) {
      setAudio({
        ...audio,
        duration: Math.ceil(currentTarget.duration)
      });
    }
  };

  const playAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.play();

    setAudio({
      ...audio,
      isPaused: false,
      isStarted: true
    });
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    setAudio({
      ...audio, isPaused: true
    });
  };

  const handleAudioEnd = () => {
    setAudio({
      ...audio,
      isPaused: true,
      isStarted: false,
      time: 0
    });
  };

  const handleAudioTimeUpdate = () => {
    setAudio({
      ...audio,
      time: Math.ceil(audioRef.current!.currentTime)
    });
  };

  return (
    <Wrapper
      reverse={isOwn}
      ref={messageRef}
      data-id={id}
      data-is-read={isRead}
      data-is-own={isOwn}>
      <Block reverse={isOwn} right={isOwn}>
        <Avatar url={avatar} small/>

        {(text || images || audio || files) && (
          <Bubble secondary={isOwn}>
            <Col gap="2.5rem">
              {images && images.map((src, idx) => (
                <ImageWrapper key={idx}>
                  <SelectableImage src={src} onLoad={handleImageLoad}/>
                </ImageWrapper>
              ))}

              {text && <Text preline>{text}</Text>}

              {audioSrc && (
                <Row align="center" gap="2rem">
                  <Icon
                    pointer
                    name={audio.isPaused ? "play" : "pause"}
                    onClick={audio.isPaused ? playAudio : pauseAudio}/>

                  <Icon name="wave"/>

                  <Text>{formatDuration(audio.isStarted ? audio.time : audio.duration)}</Text>

                  <audio
                    ref={audioRef}
                    onEnded={handleAudioEnd}
                    onDurationChange={handleAudioDurationChange}
                    onTimeUpdate={handleAudioTimeUpdate}>
                    <source src={audioSrc}/>
                  </audio>
                </Row>
              )}

              {files && files.map(({id, url, name, size}) => (
                <a key={id} href={url} target="_blank" rel="noreferrer">
                  <Row align="center" gap="1.5rem">
                    <Icon name="document"/>

                    <Col justify="space-between" width="20rem">
                      <Text small ellipsis>{name}</Text>
                      <Text small ellipsis>{prettyBytes(size)}</Text>
                    </Col>
                  </Row>
                </a>
              ))}
            </Col>

            <Row width="100%" gap="1rem" align="center" justify="flex-end">
              {isOwn && (
                <Icon
                  width={isRead ? "1.5rem" : "1rem"}
                  height={isRead ? "1.5rem" : "1rem"}
                  name={isRead ? "double-check" : "check"}/>
              )}

              <Text small>{format(date, "HH:mm")}</Text>
            </Row>
          </Bubble>
        )}
      </Block>
    </Wrapper>
  );
};

const Wrapper = styled(Row).attrs(() => ({
  width: "100%"
}))`
  margin: 2rem 0;
`;

const Block = styled(Row).attrs(() => ({
  align: "flex-end"
}))<{
  right: boolean;
}>`
  ${({right}) => css`
    & > :not(:first-child) {
      margin-left: ${!right ? "2rem" : 0};
      margin-right: ${right ? "2rem" : 0};
    }
  `};
`;

const Bubble = styled(Col).attrs(() => ({
  gap: "1.5rem",
  padding: "2rem"
}))<{
  secondary: boolean;
}>`
  ${({secondary}) => css`
    background-color: ${({theme}) => secondary ? theme.palette.secondary.light : theme.palette.primary.light};
  `};
  
  border-radius: 1rem;
`;

const ImageWrapper = styled.div`
  max-width: 20rem;
  max-height: 20rem;
`;

interface SystemMessageProps {
  text: string | null;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({text}) => (
  <Wrapper justify="center" data-is-system={true}>
    <Text>{text}</Text>
  </Wrapper>
);

export const MessageSkeleton: React.FC = () => {
  const [isOwn] = useState(Math.round(Math.random()) % 2 === 0);

  return (
    <Wrapper reverse={isOwn}>
      <Block reverse={isOwn} right={isOwn}>
        <Skeleton.Avatar small/>

        <Bubble secondary={isOwn}>
          <Col gap="2.5rem">
            <Skeleton.Text width="10rem"/>
          </Col>
        </Bubble>
      </Block>
    </Wrapper>
  );
};
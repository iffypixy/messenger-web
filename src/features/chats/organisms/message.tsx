import React, {useRef, useState} from "react";
import styled, {css} from "styled-components";
import format from "date-fns/format";
import prettyBytes from "pretty-bytes";

import {File, ID} from "@lib/typings";
import {Col, Row} from "@lib/layout";
import {formatDuration} from "@lib/formatting";
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

interface AudioState {
  duration: number;
  isPaused: boolean;
  isStarted: boolean;
  time: number;
}

export const Message: React.FC<MessageProps> = ({id, isOwn, isRead, avatar, text, date, images, files, audio: audioSrc}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const [audio, setAudio] = useState<AudioState>({
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
    if (currentTarget.duration === Infinity) {
      currentTarget.currentTime = 100000000;
    }

    const {duration} = currentTarget;

    if (duration === Infinity) return;

    setAudio({
      ...audio,
      duration: Math.ceil(duration) * 1000
    });
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
      time: Math.ceil(audioRef.current!.currentTime) * 1000
    });
  };

  return (
    <Wrapper
      reverse={isOwn}
      ref={messageRef}
      data-id={id}
      data-is-read={isRead}
      data-is-own={isOwn}>
      <Block reverse={isOwn} isOwn={isOwn}>
        <Avatar url={avatar} small/>

        {(text || images || audio || files) && (
          <Bubble isOwn={isOwn}>
            <Col gap="2.5rem">
              {images && (
                images.map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    onLoad={handleImageLoad}

                  />
                ))
              )}

              {text && (
                <Text>{text}</Text>
              )}

              {audioSrc && (
                <>
                  <Row align="center" gap="2rem">
                    <Icon
                      name={audio.isPaused ? "play" : "pause"}
                      onClick={audio.isPaused ? playAudio : pauseAudio}/>

                    <Icon name="wave"/>

                    <Text>{formatDuration(audio.isStarted ? audio.time : audio.duration)}</Text>
                  </Row>

                  <audio
                    ref={audioRef}
                    onEnded={handleAudioEnd}
                    onDurationChange={handleAudioDurationChange}
                    onTimeUpdate={handleAudioTimeUpdate}>
                    <source src={audioSrc}/>
                  </audio>
                </>
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
              {isOwn && <Icon
                width="1.5rem"
                height="1.5rem"
                name={isRead ? "double-check" : "check"}/>}
              <Text small>{format(date, "HH:mm")}</Text>
            </Row>
          </Bubble>
        )}
      </Block>
    </Wrapper>
  );
};

interface MessageStylingProps {
  isOwn: boolean;
}

const Wrapper = styled(Row).attrs(() => ({
  width: "100%"
}))`
  margin: 2rem 0;
`;

const Block = styled(Row).attrs(() => ({
  align: "flex-end"
}))<MessageStylingProps>`
  ${({isOwn}) => css`
    & > :not(:first-child) {
      margin-left: ${!isOwn ? "2rem" : 0};
      margin-right: ${isOwn ? "2rem" : 0};
    }
  `};
`;

const Bubble = styled(Col).attrs(() => ({
  gap: "1.5rem",
  padding: "2rem"
}))<MessageStylingProps>`
  ${({isOwn}) => css`
    background-color: ${({theme}) => isOwn ? theme.palette.secondary.light : theme.palette.primary.light};
  `};
  
  border-radius: 1rem;
`;

const Image = styled.img`
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

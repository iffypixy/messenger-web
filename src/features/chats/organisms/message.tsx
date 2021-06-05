import React, {useRef, useState} from "react";
import styled, {css} from "styled-components";
import format from "date-fns/format";
import prettyBytes from "pretty-bytes";

import {File} from "@lib/typings";
import {Col, Row} from "@lib/layout";
import {Icon, Text} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import {formatAudioDuration} from "../lib/format-date";

interface MessageProps {
  isOwn: boolean;
  isRead: boolean;
  avatar: string;
  text: string;
  images: string[] | null;
  audio: string | null;
  files: File[] | null;
  date: Date;
}

interface AudioData {
  duration: number;
  isPaused: boolean;
}

export const Message: React.FC<MessageProps> = ({isOwn, isRead, avatar, text, date, images, files, audio: audioSrc}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audio, setAudio] = useState<AudioData>({
    duration: 0,
    isPaused: true
  });

  const handleAudioDurationChange = () => audioRef.current && setAudio({
    ...audio, duration: audioRef.current.duration
  });

  const playAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.play();

    setAudio({
      ...audio, isPaused: false
    });
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    setAudio({
      ...audio, isPaused: true
    });
  };

  return (
    <Wrapper reverse={isOwn}>
      <Block reverse={isOwn} isOwn={isOwn}>
        <Avatar url={avatar} small/>

        {(text || images || audio || files) && (
          <Bubble isOwn={isOwn}>
            <Col gap="2.5rem">
              {images && (
                images.map((src, idx) => <Image key={idx} src={src}/>)
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

                    <Text>{formatAudioDuration(Math.ceil(audio.duration) * 1000)}</Text>
                  </Row>

                  <audio ref={audioRef} onDurationChange={handleAudioDurationChange}>
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
              {isOwn && <Icon name={isRead ? "double-check" : "check"}/>}
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
  `}
  
  border-radius: 1rem;
`;

const Image = styled.img`
  max-width: 20rem;
  max-height: 20rem;
`;

interface SystemMessageProps {
  text: string;
  date: Date;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({text, date}) => (
  <Wrapper justify="center">
    <Text>{text}</Text>
  </Wrapper>
);

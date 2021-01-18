import React, {useEffect, useRef, useState} from "react";
import styled, {css} from "styled-components";
import format from "date-fns/format";
import WaveSurfer from "wavesurfer.js";
import prettyMs from "pretty-ms";
import prettyBytes from "pretty-bytes";
import {useSelector} from "react-redux";

import {Col, Row} from "@lib/layout";
import {Attachment, User} from "@api/common";
import {Text, Avatar, Icon, Skeleton} from "@ui/atoms";
import {themingSelectors, lightTheme, darkTheme} from "@features/theming";

interface Props {
  id: string;
  text: string | null;
  attachment: Attachment | null;
  sender: User;
  createdAt: string;
  read: boolean;
  own: boolean;
}

export const Message: React.FC<Props> = ({id, text, sender, createdAt, own, read, attachment}) => {
  const [audioOptions, setAudioOptions] = useState<{wave: WaveSurfer | null; paused: boolean; progress: number; duration: number}>({
    paused: true,
    wave: null,
    progress: 0,
    duration: 0
  });

  const currentTheme = useSelector(themingSelectors.themeSelector);
  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const waveRef = useRef<HTMLDivElement>(null);
  const isAudioExist = attachment && attachment.audio;
  const areFilesExist = attachment && attachment.files && attachment.files.length;

  useEffect(() => {
    if (isAudioExist) {
      const wave = WaveSurfer.create({
        container: waveRef.current!,
        waveColor: own ? theme.palette.text.primary : theme.palette.text.secondary,
        progressColor: own ? theme.palette.text.secondary : theme.palette.text.primary,
        height: 30,
        fillParent: true,
        hideScrollbar: true,
        barMinHeight: 3,
        barWidth: 2,
        barGap: 2,
        cursorWidth: 0
      });

      setAudioOptions((options) => ({...options, wave}));

      wave.load(attachment!.audio!);

      wave.on("audioprocess", (process) => {
        setAudioOptions((options) => ({...options, progress: process / options.duration}));
      });

      wave.on("ready", () => {
        setAudioOptions((options) => ({...options, duration: wave.getDuration()}));
      });

      wave.on("play", () => {
        setAudioOptions((options) => ({...options, paused: false}));
      });

      wave.on("pause", () => {
        setAudioOptions((options) => ({...options, paused: true}));
      });

      wave.on("finish", () => {
        setAudioOptions((options) => ({...options, paused: true}));
      });
    }
  }, []);

  const handleAudioButtonClick = () => {
    if (audioOptions.wave) audioOptions.wave.playPause();
  };

  return (
    <Wrapper own={own} data-id={id} data-own={own} data-read={read}>
      <MessageBlock>
        <Header own={own}>
          <DateText>{format(new Date(createdAt), "HH:mm")}</DateText>
        </Header>
        <Block own={own}>
          <AvatarWrapper own={own}>
            <Avatar src={sender.avatar}/>
          </AvatarWrapper>

          <Col gap="1rem" align={own ? "flex-end" : "flex-start"}>
            {text && (
              <Bubble own={own}>
                <MessageText>{text}</MessageText>
              </Bubble>
            )}

            {areFilesExist && (
              <Col gap="1rem" align={own ? "flex-end" : "flex-start"}>
                {attachment!.files!.map((file, idx, arr) => (
                  <ContentWrapper own={own} key={file.id}>
                    {(idx === arr.length - 1) &&
                    <ReadStatusIcon name={read ? "double-check" : "check"} secondary own={own}/>}

                    <FileWrapper href={file.url}>
                      <Bubble own={own}>
                        <Row gap="1.5rem" align="center">
                          <Icon name="document"/>

                          <Col gap="0.5rem">
                            <Text primary small>{file.name}</Text>
                            <Text primary small>{prettyBytes(file.size)}</Text>
                          </Col>
                        </Row>
                      </Bubble>
                    </FileWrapper>
                  </ContentWrapper>
                ))}
              </Col>
            )}

            {isAudioExist && (
              <Bubble own={own}>
                <Row width="100%" align="center" gap="1rem">
                  {audioOptions.paused ? <Icon name="play" onClick={handleAudioButtonClick}/> :
                    <Icon name="pause" onClick={handleAudioButtonClick}/>}
                  <AudioWave ref={waveRef}/>
                  <Text primary small>{prettyMs(audioOptions.duration * 1000, {colonNotation: true})}</Text>
                </Row>
              </Bubble>
            )}
          </Col>

          {(own && !areFilesExist) && <ReadStatusIcon name={read ? "double-check" : "check"} secondary own={own}/>}
        </Block>
      </MessageBlock>
    </Wrapper>
  );
};


export const MessageSkeleton: React.FC = () => {
  const own = Math.round(Math.random()) % 2 === 0;

  return (
    <Wrapper own={own}>
      <MessageBlock>
        <Header own={own}>
          <Skeleton.Text width="4rem"/>
        </Header>
        <Block own={own}>
          <AvatarWrapper own={own}>
            <Skeleton.Avatar/>
          </AvatarWrapper>

          <Col>
            <Bubble own={own}>
              <Skeleton.Text width="10rem"/>
            </Bubble>
          </Col>
        </Block>
      </MessageBlock>
    </Wrapper>
  );
};

interface StylingProps {
  own: boolean;
}

const Wrapper = styled.div<StylingProps>`
  display: flex;

  ${(props) => css`
    flex-direction: ${props.own ? "row-reverse" : "row"};
  `};
`;

const MessageBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;

  & > :not(:first-child) {
    margin-top: 0.5rem;
  }
`;

const Header = styled.div<StylingProps>`
  display: flex;

  ${(props) => props.own ? css`
    justify-content: flex-end;
    padding-right: 4.5rem;
  ` : css`
    justify-content: flex-start;
    padding-left: 4.5rem;
  `};
`;

const Block = styled.div<StylingProps>`
  display: flex;
  flex-direction: ${({own}) => own ? "row-reverse" : "row"};
  align-items: flex-start;
`;

const AvatarWrapper = styled.div<StylingProps>`
  min-width: 3.5rem;
  min-height: 3.5rem;
  width: 3.5rem;
  height: 3.5rem;

  ${(props) => props.own ? css`
    margin-left: 0.5rem;
  ` : css`
    margin-right: 0.5rem;
  `}
`;

interface BubbleProps extends StylingProps {
  transparent?: boolean;
}

const Bubble = styled.div<BubbleProps>`
  display: flex;
  align-items: center;
  background-color: ${({theme, own, transparent}) => transparent ? "none" : own ? theme.palette.secondary.main : theme.palette.primary.main};
  border-radius: 10px;
  padding: 1.5rem;

  ${(props) => props.own ? css`
    border-top-right-radius: 0;
  ` : css`
    border-top-left-radius: 0;
  `}
`;

const ContentWrapper = styled.div<StylingProps>`
  display: flex;
  flex-direction: ${({own}) => own ? "row" : "row-reverse"};
`;

const FileWrapper = styled.a.attrs(() => ({
  target: "_blank"
}))`
  text-decoration: none;
`;

const DateText = styled(Text)`
  font-size: 1.2rem;
`;

const MessageText = styled(Text)`
  color: ${({theme}) => theme.palette.text.primary};
  font-size: 1.2rem;
`;

const AudioWave = styled.div`
  width: 20rem;
`;

const ReadStatusIcon = styled(Icon)<StylingProps>`
  min-width: 1.5rem;
  min-height: 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
  margin-top: auto;
  margin-bottom: 0.5rem;
  
  ${({own}) => own ? css`
    margin-right: 0.5rem; 
  ` : css`
    margin-left: 0.5rem;
  `}
`;
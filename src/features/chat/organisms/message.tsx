import React, {SyntheticEvent, useEffect, useRef, useState} from "react";
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
import {scrollElementToBottom} from "@lib/dom";

const DEFAULT_IMG_SIZE = 200;

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
  const containerRef = useRef<HTMLDivElement>(null);

  const isAudioExist = attachment && attachment.audio;
  const toRenderFiles = attachment && attachment.files && !!attachment.files.length && !isAudioExist;
  const toRenderImages = attachment && attachment.images && !!attachment.images.length && !isAudioExist;

  const toRenderReadSign = own && !isAudioExist && !toRenderImages && !toRenderFiles;

  const handleImgLoad = ({currentTarget}: SyntheticEvent<HTMLImageElement, Event>) => {
    const width = currentTarget.width;
    const height = currentTarget.height;

    if (width > height && width > DEFAULT_IMG_SIZE) {
      currentTarget.width = DEFAULT_IMG_SIZE;
      currentTarget.height = height * (DEFAULT_IMG_SIZE / width);
    } else if (height >= width && height > DEFAULT_IMG_SIZE) {
      currentTarget.height = DEFAULT_IMG_SIZE;
      currentTarget.width = width * (DEFAULT_IMG_SIZE / height);
    } else {
      currentTarget.width = width;
      currentTarget.height = height;
    }

    if (containerRef) scrollElementToBottom(containerRef.current!.parentElement!);
  };

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

  const readStatus = <ReadStatusIcon name={read ? "double-check" : "check"} secondary own={own}/>;

  return (
    <Container own={own} data-id={id} data-own={own} data-read={read} ref={containerRef}>
      <Wrapper>
        <Header own={own}>
          <DateText>{format(new Date(createdAt), "HH:mm")}</DateText>
        </Header>
        <Body own={own}>
          <AvatarWrapper own={own}>
            <Avatar src={sender.avatar}/>
          </AvatarWrapper>

          <Content gap="1rem" own={own}>
            {text && (
              <Bubble own={own}>
                <MessageText breakw="break-all">{text}</MessageText>
              </Bubble>
            )}

            {toRenderImages && (
              <ImagesWrapper>
                {attachment!.images!.map((url, idx, {length}) => (
                  <Row reverse>
                    <img src={url} onLoad={handleImgLoad} alt="Message attachment"/>

                    {(!toRenderFiles && idx === length - 1) && readStatus}
                  </Row>
                ))}
              </ImagesWrapper>
            )}

            {toRenderFiles && (
              <Col gap="1rem" align={own ? "flex-end" : "flex-start"}>
                {attachment!.files!.map((file, idx, {length}) => (
                  <Row width="fit-content" reverse={own}>
                    <FileLink href={file.url} target="_blank">
                      <Bubble own={own}>
                        <Row gap="1rem" align="center">
                          <Icon name="document"/>

                          <Col gap="0.5rem">
                            <Row maxw="20rem">
                              <Text primary small space="nowrap" overflow="ellipsis">{file.name}</Text>
                            </Row>
                            <Text primary small>{prettyBytes(file.size)}</Text>
                          </Col>
                        </Row>
                      </Bubble>
                    </FileLink>

                    {(own && idx === length - 1) && readStatus}
                  </Row>
                ))}
              </Col>
            )}

            {isAudioExist && (
              <Row reverse>
                <Bubble own={own}>
                  <Row width="100%" align="center" gap="1rem">
                    {audioOptions.paused ? <Icon name="play" onClick={handleAudioButtonClick} cursor="pointer"/> :
                      <Icon name="pause" onClick={handleAudioButtonClick} cursor="pointer"/>}
                    <AudioWave ref={waveRef}/>
                    <Text primary small>{prettyMs(audioOptions.duration * 1000, {colonNotation: true})}</Text>
                  </Row>
                </Bubble>

                {readStatus}
              </Row>
            )}
          </Content>

          {toRenderReadSign && readStatus}
        </Body>
      </Wrapper>
    </Container>
  );
};

export const MessageSkeleton: React.FC = () => {
  const own = Math.round(Math.random()) % 2 === 0;

  return (
    <Container own={own}>
      <Wrapper>
        <Header own={own}>
          <Skeleton.Text width="4rem"/>
        </Header>
        <Body own={own}>
          <AvatarWrapper own={own}>
            <Skeleton.Avatar/>
          </AvatarWrapper>

          <Col>
            <Bubble own={own}>
              <Skeleton.Text width="10rem"/>
            </Bubble>
          </Col>
        </Body>
      </Wrapper>
    </Container>
  );
};

interface StylingProps {
  own: boolean;
}

const Container = styled.div<StylingProps>`
  display: flex;
  width: 100%;
  max-width: 100%;

  ${(props) => css`
    flex-direction: ${props.own ? "row-reverse" : "row"};
  `};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-width: 100%;

  & > :not(:first-child) {
    margin-top: 0.5rem;
  }
`;

const Header = styled.div<StylingProps>`
  display: flex;

  ${(props) => props.own ? css`
    justify-content: flex-end;
    padding-right: 4rem;
  ` : css`
    justify-content: flex-start;
    padding-left: 4rem;
  `};
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


const Body = styled.div<StylingProps>`
  display: flex;
  flex-direction: ${({own}) => own ? "row-reverse" : "row"};
  align-items: flex-start;
`;

const Content = styled(Col)<StylingProps>`
  align-items: ${({own}) => own ? "flex-end" : "flex-start"};
`;

interface BubbleProps extends StylingProps {
  transparent?: boolean;
}

const Bubble = styled.div<BubbleProps>`
  display: flex;
  align-items: center;
  max-width: 100%;
  background-color: ${({theme, own, transparent}) => transparent ? "none" : own ? theme.palette.secondary.main : theme.palette.primary.main};
  border-radius: 10px;
  padding: 1.5rem;

  ${(props) => props.own ? css`
    border-top-right-radius: 0;
  ` : css`
    border-top-left-radius: 0;
  `}
`;

const FileLink = styled.a.attrs(() => ({
  target: "_blank"
}))`
  text-decoration: none;
`;

const ImagesWrapper = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  max-width: 45rem;

  & > div {
    margin: 0.5rem;
  }
  
  & img {
    background-color: ${({theme}) => theme.palette.background.default};
    max-width: 200px;
    max-height: 200px;
  }
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
  
  ${({own}) => own ? css`
    margin-right: 0.5rem; 
  ` : css`
    margin-left: 0.5rem;
  `}
`;
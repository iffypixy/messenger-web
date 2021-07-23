import React, {useEffect, useRef, useState} from "react";
import Modal, {Props} from "react-modal";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import prettyBytes from "pretty-bytes";

import {formatDate, SelectableImage} from "@features/chats";
import {Col, Row} from "@lib/layout";
import {customStyles} from "@lib/modal";
import {ID} from "@lib/typings";
import {formatDuration} from "@lib/date";
import {useRootDispatch} from "@lib/store";
import {Avatar} from "@ui/molecules";
import {H5, Icon, Loader, Text} from "@ui/atoms";
import * as selectors from "../selectors";
import * as actions from "../actions";

interface DirectModalProps extends Props {
  closeModal: () => void;
}

export const DirectModal: React.FC<DirectModalProps> = ({closeModal, ...props}) => {
  const dispatch = useRootDispatch();

  const {partnerId} = useParams<{
    partnerId: ID;
  }>();

  const [isAttachedImagesModalOpen, setIsAttachedImagesModalOpen] = useState(false);
  const [isAttachedFilesModalOpen, setIsAttachedFilesModalOpen] = useState(false);
  const [isAttachedAudiosModalOpen, setIsAttachedAudiosModalOpen] = useState(false);

  const chat = useSelector(selectors.chat(partnerId))!;

  const handleBanningPartner = () => {
    dispatch(actions.setDirect({
      partnerId, direct: {
        ...chat, partner: {
          ...chat.partner, isBanned: true
        }
      }
    }));

    dispatch(actions.fetchBanningPartner({partnerId}));
  };

  const handleUnbanningPartner = () => {
    dispatch(actions.setDirect({
      partnerId, direct: {
        ...chat, partner: {
          ...chat.partner, isBanned: false
        }
      }
    }));

    dispatch(actions.fetchUnbanningPartner({partnerId}));
  };

  return (
    <Modal style={customStyles} {...props}>
      <AttachedImagesModal
        isOpen={isAttachedImagesModalOpen}
        closeModal={() => setIsAttachedImagesModalOpen(false)}
        onRequestClose={() => setIsAttachedImagesModalOpen(false)}/>

      <AttachedFilesModal
        isOpen={isAttachedFilesModalOpen}
        closeModal={() => setIsAttachedFilesModalOpen(false)}
        onRequestClose={() => setIsAttachedFilesModalOpen(false)}/>

      <AttachedAudiosModal
        isOpen={isAttachedAudiosModalOpen}
        closeModal={() => setIsAttachedAudiosModalOpen(false)}
        onRequestClose={() => setIsAttachedAudiosModalOpen(false)}/>

      <Wrapper>
        <Row justify="space-between" align="center" padding="2.25rem 3rem 1.25rem">
          <H5>Direct info</H5>

          <Icon
            name="cross"
            onClick={closeModal}
            secondary pointer/>
        </Row>

        <Row align="center" gap="2rem" padding="2.25rem 3rem">
          <Avatar url={chat.partner.avatar}/>

          <Col width="65%" gap="0.75rem">
            <Text width="100%" ellipsis medium>{chat.partner.username}</Text>
            <Text small secondary>last seen at {formatDate(new Date(chat.partner.lastSeen))}</Text>
          </Col>
        </Row>

        <Border/>

        <Col padding="1.25rem 3rem">
          <Row gap="4rem" align="center" padding="1rem 0">
            <Icon name="info" secondary/>

            <Col width="75%" justify="space-between" gap="0.5rem">
              <Text width="100%" ellipsis medium>{chat.partner.username}</Text>
              <Text small secondary>Username</Text>
            </Col>
          </Row>
        </Col>

        <Border/>

        <Col padding="1.25rem 0">
          <ListItem onClick={() => setIsAttachedImagesModalOpen(true)}>
            <Icon name="image" secondary/>
            <Text medium>images</Text>
          </ListItem>

          <ListItem onClick={() => setIsAttachedFilesModalOpen(true)}>
            <Icon name="file" secondary/>
            <Text medium>files</Text>
          </ListItem>

          <ListItem onClick={() => setIsAttachedAudiosModalOpen(true)}>
            <Icon name="microphone" secondary/>
            <Text medium>audios</Text>
          </ListItem>
        </Col>

        <Border/>

        <Col padding="1.25rem 0">
          <ListItem onClick={chat.partner.isBanned ? handleUnbanningPartner : handleBanningPartner}>
            <Icon name="unavailable" error/>
            <Text error medium>{chat.partner.isBanned ? "Unblock user" : "Block user"}</Text>
          </ListItem>
        </Col>
      </Wrapper>
    </Modal>
  );
};

const Border = styled.div`
  width: 100%;
  height: 1rem;
  background-color: ${({theme}) => theme.palette.primary.light};
`;

const ListItem = styled(Row).attrs(() => ({
  gap: "4rem",
  padding: "1rem 3rem",
  align: "center"
}))`
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.palette.primary.light};
  }
`;

interface AttachedImagesModalProps extends Props {
  closeModal: () => void;
}

const AttachedImagesModal: React.FC<AttachedImagesModalProps> = ({closeModal, ...props}) => {
  const dispatch = useRootDispatch();

  const {partnerId} = useParams<{
    partnerId: ID;
  }>();

  const images = useSelector(selectors.attachedImages(partnerId));
  const areImagesFetching = useSelector(selectors.areAttachedImagesFetching(partnerId));

  useEffect(() => {
    dispatch(actions.fetchAttachedImages({
      partnerId, skip: 0
    }));
  }, []);

  return (
    <Modal style={customStyles} {...props}>
      <Wrapper>
        <Row justify="space-between" align="center" padding="2rem">
          <H5>Attached images</H5>

          <Icon
            name="cross"
            onClick={closeModal}
            secondary pointer/>
        </Row>

        <Row padding="2rem 0" wrap="wrap">
          {[...images]
            .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
            .map(({id, url}) => (
              <Row key={id} width="10rem" height="10rem" padding="0.75rem">
                <SelectableImage src={url} alt="attached-image"/>
              </Row>
            ))}

          {areImagesFetching && <Loader/>}
        </Row>
      </Wrapper>
    </Modal>
  );
};

interface AttachedFilesModalProps extends Props {
  closeModal: () => void;
}

const AttachedFilesModal: React.FC<AttachedFilesModalProps> = ({closeModal, ...props}) => {
  const dispatch = useRootDispatch();

  const {partnerId} = useParams<{
    partnerId: ID;
  }>();

  const files = useSelector(selectors.attachedFiles(partnerId));
  const areFilesFetching = useSelector(selectors.areAttachedFilesFetching(partnerId));

  useEffect(() => {
    dispatch(actions.fetchAttachedFiles({
      partnerId, skip: 0
    }));
  }, []);

  return (
    <Modal style={customStyles} {...props}>
      <Wrapper>
        <Row justify="space-between" align="center" padding="2rem">
          <H5>Attached files</H5>

          <Icon
            name="cross"
            onClick={closeModal}
            secondary pointer/>
        </Row>

        <Col gap="1.5rem" padding="2rem">
          {[...files]
            .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
            .map(({id, file, createdAt}) => (
              <a key={id} href={file.url} target="_blank" rel="noreferrer">
                <Row gap="2rem">
                  <Icon name="document" width="6rem" height="6rem"/>

                  <Col justify="space-between" padding="0.35rem 0">
                    <Col gap="0.25rem">
                      <Text small>{file.name}</Text>
                      <Text small secondary>{prettyBytes(file.size)}</Text>
                    </Col>

                    <Text small secondary>{formatDate(new Date(createdAt))}</Text>
                  </Col>
                </Row>
              </a>
            ))}

          {areFilesFetching && <Loader/>}
        </Col>
      </Wrapper>
    </Modal>
  );
};

interface AttachedAudiosModalProps extends Props {
  closeModal: () => void;
}

const AttachedAudiosModal: React.FC<AttachedAudiosModalProps> = ({closeModal, ...props}) => {
  const dispatch = useRootDispatch();

  const {partnerId} = useParams<{
    partnerId: ID;
  }>();

  const audios = useSelector(selectors.attachedAudios(partnerId));
  const areAudiosFetching = useSelector(selectors.areAttachedAudiosFetching(partnerId));

  useEffect(() => {
    dispatch(actions.fetchAttachedAudios({
      partnerId, skip: 0
    }));
  }, []);

  return (
    <Modal style={customStyles} {...props}>
      <Wrapper>
        <Row justify="space-between" align="center" padding="2rem">
          <H5>Audios</H5>

          <Icon
            name="cross"
            onClick={closeModal}
            secondary pointer/>
        </Row>

        <Col gap="1.5rem" padding="2rem">
          {[...audios]
            .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
            .map(({id, url, createdAt}) => <AudioController key={id} src={url} date={new Date(createdAt)}/>)}

          {areAudiosFetching && <Loader/>}
        </Col>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled(Col).attrs(() => ({
  width: "40rem",
  padding: "1rem 0"
}))`
  max-height: 90vh;
  background-color: ${({theme}) => theme.palette.primary.main};
  border-radius: 1rem;
  overflow-x: hidden;
`;

interface AudioControllerProps {
  src: string;
  date: Date;
}

const AudioController: React.FC<AudioControllerProps> = ({src, date}) => {
  const [isPaused, setIsPaused] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioDurationChange = ({currentTarget}: React.ChangeEvent<HTMLAudioElement>) => {
    if (currentTarget.duration === Infinity) currentTarget.currentTime = 10e10;
    if (currentTarget.duration !== Infinity) setDuration(Math.ceil(currentTarget.duration));
  };

  const handleAudioPlay = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const handleControlsClick = () => {
    const audio = audioRef.current!;

    if (isPaused) audio.play();
    else audio.pause();
  };

  return (
    <Row gap="2rem" align="center">
      <Icon
        pointer
        onClick={handleControlsClick}
        name={isPaused ? "play" : "pause"}/>

      <Text small>
        {isStarted ? `${formatDuration(time)} / ${formatDuration(duration)}` : `recorded at ${formatDate(date)}`}
      </Text>

      <audio
        ref={audioRef}
        onPlay={handleAudioPlay}
        onTimeUpdate={({currentTarget}) => setTime(Math.ceil(currentTarget.currentTime))}
        onPause={() => setIsPaused(true)}
        onEnded={() => setIsStarted(false)}
        onDurationChange={handleAudioDurationChange}>
        <source src={src}/>
      </audio>
    </Row>
  );
};
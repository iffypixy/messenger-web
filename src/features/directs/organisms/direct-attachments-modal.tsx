import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import {useSelector} from "react-redux";
import prettyBytes from "pretty-bytes";

import {useRootDispatch} from "@lib/store";
import {ID} from "@lib/typings";
import {Col, Row} from "@lib/layout";
import {Modal, ModalProps} from "@lib/modal";
import {Icon, Text} from "@ui/atoms";
import * as actions from "../actions";
import * as selectors from "../selectors";

export type Attachment = "images" | "files" | "audios";

export const DirectAttachmentsModal: React.FC<ModalProps> = ({closeModal}) => {
  const dispatch = useRootDispatch();

  const [tab, useTab] = useState<Attachment>("images");

  const {partnerId} = useParams<{partnerId: ID}>();

  const files = useSelector(selectors.files(partnerId));
  const areFilesFetching = useSelector(selectors.areFilesFetching(partnerId));

  const images = useSelector(selectors.images(partnerId));
  const areImagesFetching = useSelector(selectors.areImagesFetching(partnerId));

  const audios = useSelector(selectors.audios(partnerId));
  const areAudiosFetching = useSelector(selectors.areAudiosFetching(partnerId));

  useEffect(() => {
    if (tab === "images") {
      if (!areImagesFetching) {
        dispatch(actions.fetchAttachedImages({
          partnerId, skip: 0
        }));
      }
    } else if (tab === "files") {
      if (!areFilesFetching) {
        dispatch(actions.fetchAttachedFiles({
          partnerId, skip: 0
        }));
      }
    } else if (tab === "audios") {
      if (!areAudiosFetching) {
        dispatch(actions.fetchAttachedAudios({
          partnerId, skip: 0
        }));
      }
    }
  }, [tab]);

  const sortedImages = [...images].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  const sortedFiles = [...files].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  const sortedAudios = [...audios].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

  return (
    <Modal closeModal={closeModal}>
      <Wrapper>
        <Header>
          <Row gap="2rem">
            <Text clickable onClick={() => useTab("images")}>Images</Text>
            <Text clickable onClick={() => useTab("audios")}>Audios</Text>
            <Text clickable onClick={() => useTab("files")}>Files</Text>
          </Row>

          <Icon
            onClick={closeModal}
            name="cross"
            pointer/>
        </Header>

        <Content>
          {tab === "images" ? (
            <Row gap="1rem" wrap="wrap">
              {sortedImages.map(({id, url}) => (
                <img key={id} src={url} alt="attachment"/>
              ))}
            </Row>
          ) : tab === "files" ? (
            <Col gap="1.5rem">
              {sortedFiles.map(({id, file: {url, name, size}}) => (
                <a key={id} href={url} target="_blank" rel="noreferrer">
                  <Row align="center" gap="1.5rem">
                    <Icon name="document"/>

                    <Col justify="space-between" width="20rem">
                      <Text ellipsis>{name}</Text>
                      <Text ellipsis>{prettyBytes(size)}</Text>
                    </Col>
                  </Row>
                </a>
              ))}
            </Col>
          ) : tab === "audios" ? (
              <Col gap="1.5rem">{sortedAudios.map(({id, url}) => (
                <audio controls key={id}>
                  <source src={url}/>
                </audio>
              ))}</Col>
            ) : null}
        </Content>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled(Col).attrs(() => ({
  width: "85rem"
}))`
  max-height: 75vh;
`;

const Header = styled(Row).attrs(() => ({
  width: "100%",
  justify: "space-between",
  padding: "2rem"
}))`
  background-color: ${({theme}) => theme.palette.primary.main};
`;

const Content = styled.div`
  width: 100%;
  background-color: ${({theme}) => theme.palette.primary.light};
  overflow: auto;
  padding: 2rem;
`;
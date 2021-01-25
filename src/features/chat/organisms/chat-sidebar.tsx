import React, {useState} from "react";
import styled from "styled-components";

import {Col, Row} from "@lib/layout";
import {File} from "@api/common";
import {Text, Icon, Avatar, Button} from "@ui/atoms";

interface Props {
  files: {
    list: File[];
    fetching: boolean;
    number: number;
  };

  images: {
    number: number;
    list: string[];
    fetching: boolean;
  };

  audios: {
    number: number;
    list: string[];
    fetching: boolean;
  };

  title: string;
  subtitle: string;
  avatar: string;
  fetching: boolean;
  handleClose: () => void;
}

export const ChatSidebar: React.FC<Props> = ({files, images, audios, avatar, title, subtitle, handleClose}) => {
  const [listType, setListType] = useState<"images" | "files" | "audios" | null>(null);


  return (
    <Sidebar>
      {listType === "images" && (
        <ImagesWrapper>
          {images.list && images.list.map((url) => (
            <Image src={url} />
          ))}
        </ImagesWrapper>
      )}

      {!listType && (
        <>
          <Header>
            <Row align="center" justify="space-between">
              <Text primary>Information</Text>
              <Icon onClick={handleClose} name="cross" width="1.25rem" height="1.25rem"
                    cursor="pointer" secondary/>
            </Row>
          </Header>

          <ChatBlock gap="2rem" align="center">
            <AvatarWrapper>
              <Avatar src={avatar}/>
            </AvatarWrapper>

            <Col gap="1rem">
              <Text primary>{title}</Text>
              <Text small>{subtitle}</Text>
            </Col>
          </ChatBlock>

          <AttachmentBlock>
            {files.number > 0 && (
              <AttachmentItem gap="2.5rem" align="center">
                <Row width="2.5rem">
                  <Icon width="1.8rem" height="1.8rem" name="document"/>
                </Row>

                <Text primary small>{files.number} files</Text>
              </AttachmentItem>
            )}

            {images.number > 0 && (
              <AttachmentItem gap="2.5rem" align="center" onClick={() => setListType("images")}>
                <Row width="2.5rem">
                  <Icon width="1.8rem" height="1.8rem" name="picture"/>
                </Row>

                <Text primary small>{images.number} images</Text>
              </AttachmentItem>
            )}

            {audios.number > 0 && (
              <AttachmentItem gap="2.5rem" align="center">
                <Row width="2.5rem">
                  <Icon width="1.6rem" height="1.6rem" name="audio"/>
                </Row>

                <Text primary small>{audios.number} audio</Text>
              </AttachmentItem>
            )}
          </AttachmentBlock>

          <ServiceBlock>
            <ServiceButton pure small>
              <Row gap="2.5rem">
                <Row width="2.5rem"/>

                <Row>Delete chat</Row>
              </Row>
            </ServiceButton>

            <ServiceButton pure small>
              <Row gap="2.5rem">
                <Row width="2.5rem"/>

                <Row>Report</Row>
              </Row>
            </ServiceButton>
          </ServiceBlock>
        </>
      )}
    </Sidebar>
  );
};

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 27.5rem;
  height: 100%;
  background-color: ${({theme}) => theme.palette.primary.main};
  transition: width 0.2s linear;
`;

const ChatBlock = styled(Row)`
  border-bottom: 2px solid ${({theme}) => theme.palette.primary.dark};
  padding: 2rem;
`;

const AvatarWrapper = styled.div`
  width: 5.5rem;
  height: 5.5rem;
`;

const AttachmentBlock = styled(Col)`
  border-bottom: 2px solid ${({theme}) => theme.palette.primary.dark};
  padding: 1rem 0;
`;

const Header = styled.div`
  border-bottom: 2px solid ${({theme}) => theme.palette.primary.dark};
  padding: 2.5rem;
`;

const AttachmentItem = styled(Row)`
  cursor: pointer;
  padding: 1.5rem 2.5rem;
  
  &:hover {
    background-color: ${({theme}) => theme.palette.primary.dark};
  }
`;

const ServiceBlock = styled(Col)`
  width: 100%;
  padding: 1rem 0;
`;

const ServiceButton = styled(Button)`
  width: 100%;
  padding: 1.5rem 2.5rem;
  
  &:hover {
    background-color: ${({theme}) => theme.palette.primary.dark};
  }
`;

const ImagesWrapper = styled(Row)`
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Image = styled.img`
  width: 27.5%;
`;
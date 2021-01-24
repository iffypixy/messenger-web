import React from "react";
import styled from "styled-components";

import {Col, Row} from "@lib/layout";
import {File} from "@api/common";
import {Text, Icon} from "@ui/atoms";

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

  fetching: boolean;
}

export const AttachmentSidebar: React.FC<Props> = ({files, images, audios}) => {
  return (
    <Sidebar>
      <Content>
        {files.number > 0 && <AttachmentItem gap="4rem" align="center">
          <Row width="2.5rem">
            <Icon width="1.8rem" height="1.8rem" name="document"/>
          </Row>

          <Text primary small>{files.number} files</Text>
        </AttachmentItem>}

        {images.number > 0 && <AttachmentItem gap="4rem" align="center">
          <Row width="2.5rem">
            <Icon width="1.8rem" height="1.8rem" name="picture"/>
          </Row>

          <Text primary small>{images.number} images</Text>
        </AttachmentItem>}

        {audios.number > 0 && <AttachmentItem gap="4rem" align="center">
          <Row width="2.5rem">
            <Icon width="1.6rem" height="1.6rem" name="audio"/>
          </Row>

          <Text primary small>{audios.number} audio</Text>
        </AttachmentItem>}
      </Content>
    </Sidebar>
  );
};

const Sidebar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 27.5rem;
  height: 100%;
  background-color: ${({theme}) => theme.palette.primary.main};
`;

const Content = styled(Col)`
  width: 100%;
`;

const AttachmentItem = styled(Row)`
  cursor: pointer;
  padding: 1rem 3rem;
  
  &:hover {
    background-color: ${({theme}) => theme.palette.primary.dark};
  }
`;
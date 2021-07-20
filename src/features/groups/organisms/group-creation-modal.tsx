import React from "react";
import styled from "styled-components";

import {ModalProps, Modal} from "@lib/modal";
import {Col, Row} from "@lib/layout";
import {H4, Icon} from "@ui/atoms";

export const GroupCreationModal: React.FC<ModalProps> = ({closeModal}) => {
  return (
    <Modal closeModal={closeModal}>
      <Wrapper>
        <Header>
          <div />

          <H4>Choose which one to create</H4>

          <Icon
            onClick={closeModal}
            name="cross"
            pointer/>
        </Header>

        <Content>
          <Answer />
          <Answer />
        </Content>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled(Col).attrs(() => ({
  width: "65rem"
}))`
  max-height: 75vh;
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 1rem;
`;

const Header = styled(Row).attrs(() => ({
  width: "100%",
  justify: "space-between",
  padding: "2rem",
  align: "center"
}))`
  border-bottom: 2px solid ${({theme}) => theme.palette.divider};
`;

const Content = styled(Col).attrs(() => ({
  width: "100%",
  padding: "2rem"
}))`  
`;

const Answer = styled.div`
  width: 100%;
  background-color: ${({theme}) => theme.palette.primary.main};
  border-radius: 1rem;
  padding: 1rem;
`;

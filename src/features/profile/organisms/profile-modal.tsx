import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {ModalBackground} from "@ui/organisms";
import {Avatar, Text, Icon} from "@ui/atoms";
import {Col, Row} from "@lib/layout";
import {authSelectors} from "@features/auth";

interface Props {
  closeModal: () => void;
}

export const ProfileModal: React.FC<Props> = ({closeModal}) => {
  const credentials = useSelector(authSelectors.credentialsSelector);

  return (
    <>
      <ModalBackground onClick={closeModal}/>

      <Modal>
        <Profile>
          <UserAvatar>
            <Avatar src={credentials!.avatar}/>
          </UserAvatar>

          <Text primary type="bold">{credentials!.firstName}</Text>
        </Profile>

        <Settings gap="1.5rem">
          <Row width="100%" justify="space-between" align="flex-end">
            <Col gap="0.5rem">
              <Text transform="uppercase" small>Username</Text>
              <Text primary small>{credentials!.firstName}</Text>
            </Col>

            <Icon name="pencil" cursor="pointer"/>
          </Row>

          <Row width="100%" justify="space-between" align="flex-end">
            <Col gap="0.5rem">
              <Text transform="uppercase" small>Password</Text>
              <Text primary small>qwerty123</Text>
            </Col>

            <Icon name="pencil" cursor="pointer"/>
          </Row>
        </Settings>
      </Modal>
    </>
  );
};

const Modal = styled.div`
  width: 25%;
  background-color: ${({theme}) => theme.palette.primary.dark};
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 7rem;
  height: 7rem;
  margin-right: 1.5rem;
`;

const Settings = styled(Col)`
  background-color: ${({theme}) => theme.palette.primary.main};
  border-radius: 5px;
  padding: 1.5rem;
  margin-top: 2rem;
`;



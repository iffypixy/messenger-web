import React, {useState, MouseEvent} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {ModalBackground} from "@ui/organisms";
import {Avatar, Text, Input, Button, Loader, Icon} from "@ui/atoms";
import {Col, Row} from "@lib/layout";
import {useActions} from "@lib/hooks";
import {AvatarEditor} from "@lib/avatar-editor";
import {authSelectors, authActions} from "@features/auth";
import {User} from "@api/common";
import * as actions from "../actions";
import * as selectors from "../selectors";

interface Props {
  closeModal: () => void;
}

export const ProfileModal: React.FC<Props> = ({closeModal}) => {
  const credentials = useSelector(authSelectors.credentialsSelector);
  const isUpdateProfileFetching = useSelector(selectors.isUpdateProfileFetchingSelector);

  const [data, setData] = useState<User>(credentials!);
  const [image, setImage] = useState<File | null>(null);

  const {firstName, lastName} = data;

  const {fetchUpdateProfile, fetchLogout} = useActions({...actions, ...authActions});

  const handleSaveButtonClick = () => {
    fetchUpdateProfile(data)
      .then(closeModal);
  };

  const handleLogoutButtonClick = () => {
    fetchLogout();
  };

  const handleAvatarInputChange = ({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
    const file = currentTarget.files![0];

    setImage(file);
  };

  const handleAvatarInputClick = ({currentTarget}: MouseEvent<HTMLInputElement>) => {
    currentTarget.value = "";
  };

  const handleEditorSave = (blob: Blob) => {
    fetchUpdateProfile({avatar: blob});

    setImage(null);
  };

  const handleEditorClose = () => {
    setImage(null);
  };

  return (
    <>
      <ModalBackground onClick={closeModal}/>

      {image && (
        <AvatarEditor title="Edit avatar"
                      onSave={handleEditorSave}
                      onClose={handleEditorClose}
                      width={300}
                      height={300}
                      borderRadius={150}
                      border={75}
                      image={image}/>
      )}

      <Modal>
        <Profile>
          <Input type="file" hidden name="avatar" accept="image/*" onClick={handleAvatarInputClick} label={(
            <UserAvatar>
              <Avatar src={credentials!.avatar}/>

              <AvatarIconWrapper>
                <Icon name="img-upload"/>
              </AvatarIconWrapper>
            </UserAvatar>
          )} onChange={handleAvatarInputChange}/>

          <Text primary type="bold">{credentials!.fullName}</Text>
        </Profile>

        <Settings gap="1.5rem">
          <Col gap="0.5rem" width="100%">
            <Text transform="uppercase" small>First name</Text>
            <Row width="100%" justify="space-between" align="center">
              <Input
                value={firstName}
                width="100%"
                onChange={({currentTarget}) => setData({...data, firstName: currentTarget.value})}
                small/>
            </Row>
          </Col>

          <Col gap="0.5rem" width="100%">
            <Text transform="uppercase" small>Last name</Text>
            <Row width="100%" justify="space-between" align="center">
              <Input value={lastName}
                     width="100%"
                     onChange={({currentTarget}) => setData({...data, lastName: currentTarget.value})}
                     small/>
            </Row>
          </Col>
        </Settings>

        <Footer width="100%" justify="space-between" align="center">
          <Button onClick={handleLogoutButtonClick} danger small>Logout</Button>

          <Button onClick={handleSaveButtonClick}
                  disabled={isUpdateProfileFetching} small>{isUpdateProfileFetching ?
            <Loader name="interwind"/> : "Save"}</Button>
        </Footer>
      </Modal>
    </>
  );
};

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  background-color: ${({theme}) => theme.palette.primary.main};
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
  cursor: pointer;
  position: relative;
  margin-right: 1.5rem;
  
  & > img {
    background-color: ${({theme}) => theme.palette.primary.dark};
  }
  
  &:hover > img {
    opacity: 0.4;
  }
`;

const AvatarIconWrapper = styled.div`
  background-color: ${({theme}) => theme.palette.secondary.main};
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  padding: 7px;
`;

const Settings = styled(Col)`
  background-color: ${({theme}) => theme.palette.primary.dark};
  border-radius: 5px;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const Footer = styled(Row)`
  border-top: 2px solid ${({theme}) => theme.palette.primary.dark};
  padding-top: 2rem;
`;

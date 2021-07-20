import React, {useState} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {authSelectors, authActions} from "@features/auth";
import {Col, Row} from "@lib/layout";
import {useRootDispatch} from "@lib/store";
import {ModalProps, Modal, useModal} from "@lib/modal";
import {AvatarEditorModal} from "@lib/avatar-editor";
import {Text, Input, Button} from "@ui/atoms";
import {Avatar} from "@ui/molecules";
import * as actions from "../actions";
import * as selectors from "../selectors";

interface ProfileForm {
  username: string;
  avatar: string;
}

export const ProfileModal: React.FC<ModalProps> = ({closeModal}) => {
  const dispatch = useRootDispatch();

  const credentials = useSelector(authSelectors.credentials)!;
  const isUpdatingProfileFetching = useSelector(selectors.isUpdatingProfileFetching);

  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    username: credentials.username,
    avatar: credentials.avatar
  });

  const {isModalOpen: isEditorModelOpen, openModal: openEditorModel, closeModal: closeEditorModal} = useModal();

  const handleSave = () => {
    dispatch(actions.fetchUpdatingProfile({
      username: form.username,
      avatar: avatarBlob as globalThis.File
    })).then(closeModal);
  };

  const handleLogout = () => {
    dispatch(authActions.fetchLogout());
  };

  const handleAvatarChange = ({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
    const file = currentTarget.files && currentTarget.files[0];

    if (!file) return;

    setAvatarBlob(file as globalThis.File);

    openEditorModel();
  };

  const handleAvatarSave = (blob: Blob) => {
    closeEditorModal();

    setForm((form) => ({
      ...form, avatar: URL.createObjectURL(blob)
    }));
  };

  return (
    <Modal closeModal={closeModal}>
      {(isEditorModelOpen && avatarBlob) && (
        <AvatarEditorModal
          title="Edit image"
          width={300}
          height={300}
          borderRadius={150}
          border={75}
          image={URL.createObjectURL(avatarBlob)}
          handleSave={handleAvatarSave}
          closeModal={closeEditorModal}/>
      )}

      <Wrapper>
        <Row align="center" gap="2rem">
          <Input type="file"
                 name="avatar"
                 onChange={handleAvatarChange}
                 label={(
                   <AvatarWrapper>
                     <Avatar url={form.avatar}/>
                   </AvatarWrapper>
                 )} hidden/>
          <Text>{credentials.username}</Text>
        </Row>

        <Settings>
          <Col gap="1rem" width="100%">
            <Text uppercase small>Username</Text>
            <Input
              width="100%"
              value={form.username}
              onChange={({currentTarget}) => setForm({...form, username: currentTarget.value})}
              secondary small/>
          </Col>
        </Settings>

        <Footer>
          <Button
            onClick={handleLogout}
            danger small>Logout</Button>

          <Button
            onClick={handleSave}
            disabled={isUpdatingProfileFetching}
            small>Save</Button>
        </Footer>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled(Col).attrs(() => ({
  width: "65rem",
  padding: "2rem"
}))`
  max-height: 75vh;
  background-color: ${({theme}) => theme.palette.primary.main};
  border-radius: 1rem;
`;

const AvatarWrapper = styled.div`
  cursor: pointer;
`;

const Settings = styled(Col).attrs(() => ({
  gap: "1.5rem",
  padding: "1.5rem"
}))`
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 5px;
  margin: 2.5rem 0;
`;

const Footer = styled(Row).attrs(() => ({
  width: "100%",
  justify: "space-between",
  align: "center"
}))`
  border-top: 2px solid ${({theme}) => theme.palette.divider};
  padding-top: 2rem;
`;

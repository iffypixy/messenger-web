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
import * as yup from "yup";
import {regex} from "@lib/regex";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  username: yup.string()
    .required("Username is required")
    .matches(regex.alphaNumeric, "Username must contain only numbers and letters")
    .min(3, "Username must contain at least 3 characters")
});

interface ProfileForm {
  username: string;
}

export const ProfileModal: React.FC<ModalProps> = ({closeModal}) => {
  const dispatch = useRootDispatch();

  const credentials = useSelector(authSelectors.credentials)!;
  const isUpdatingProfileFetching = useSelector(selectors.isUpdatingProfileFetching);

  const [avatar, setAvatar] = useState<{
    blob: Blob | null;
    url: string;
  }>({
    blob: null,
    url: credentials.avatar
  });

  const {isModalOpen: isEditorModelOpen, openModal: openEditorModel, closeModal: closeEditorModal} = useModal();

  const {register, handleSubmit, formState: {errors, isValid}} = useForm<ProfileForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: credentials.username
    }
  });

  const handleSave = ({username}: ProfileForm) => {
    dispatch(actions.fetchUpdatingProfile({
      username, avatar: avatar.blob as globalThis.File
    })).then(closeModal);
  };

  const handleLogout = () => {
    dispatch(authActions.fetchLogout());
  };

  const handleAvatarChange = ({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
    const file = currentTarget.files && currentTarget.files[0];

    if (!file) return;

    setAvatar((avatar) => ({...avatar, blob: file as globalThis.File}));

    openEditorModel();
  };

  const handleAvatarSave = (blob: Blob) => {
    closeEditorModal();

    setAvatar({
      url: URL.createObjectURL(blob), blob
    });
  };

  return (
    <Modal closeModal={closeModal}>
      {(isEditorModelOpen && avatar.blob) && (
        <AvatarEditorModal
          title="Edit image"
          width={300}
          height={300}
          borderRadius={150}
          border={75}
          image={URL.createObjectURL(avatar.blob)}
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
                     <Avatar url={avatar.url}/>
                   </AvatarWrapper>
                 )} hidden/>
          <Text width="80%" ellipsis>{credentials.username}</Text>
        </Row>

        <Form>
          <Col gap="1rem" width="100%">
            <Text uppercase small>Username</Text>
            <Input
              {...register("username")}
              width="100%"
              type="text"
              error={errors.username?.message}
              name="username"
              secondary small/>
          </Col>
        </Form>

        <Footer>
          <Button
            onClick={handleLogout}
            danger small>Logout</Button>

          <Button
            onClick={handleSubmit(handleSave)}
            disabled={isUpdatingProfileFetching || !isValid}
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

const Form = styled.form`
  background-color: ${({theme}) => theme.palette.primary.light};
  border-radius: 5px;
  margin: 2.5rem 0;
  padding: 1.5rem;
`;

const Footer = styled(Row).attrs(() => ({
  width: "100%",
  justify: "space-between",
  align: "center"
}))`
  border-top: 2px solid ${({theme}) => theme.palette.divider};
  padding-top: 2rem;
`;

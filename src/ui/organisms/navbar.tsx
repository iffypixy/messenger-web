import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";

import {authSelectors} from "@features/auth";
import {ProfileModal} from "@features/profile";
import {Avatar, Icon} from "@ui/atoms";
import {useModal} from "@lib/hooks";

export const Navbar: React.FC = () => {
  const {closeModal, openModal, isModalOpen} = useModal();
  const credentials = useSelector(authSelectors.credentialsSelector);

  return (
    <>
      {isModalOpen && <ProfileModal closeModal={closeModal} />}

      <Wrapper>
        <LogoIcon name="logo"/>

        <UserAvatar onClick={openModal}>
          <Avatar src={credentials?.avatar}/>
        </UserAvatar>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 10%;
    background-color: ${(({theme}) => theme.palette.primary.main)};
    padding: 2% 0;
`;

const UserAvatar = styled.div`
  width: 30%;
  cursor: pointer;
`;

const LogoIcon = styled(Icon)`
  width: 30%;
  height: auto;
`;
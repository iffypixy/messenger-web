import React from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

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
        <Link to="/">
          <LogoIcon name="logo"/>
        </Link>

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
  width: 6rem;
  height: 6rem;
  background-color: ${({theme}) => theme.palette.primary.dark};
  border-radius: 50%;
  box-shadow: 0 0 10px 2px #000000;
  cursor: pointer;
`;

const LogoIcon = styled(Icon)`
  width: 5rem;
  height: 5rem;
`;
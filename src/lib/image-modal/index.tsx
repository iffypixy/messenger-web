import React from "react";
import styled from "styled-components";

import {ModalBackground} from "@ui/organisms";

interface Props {
  url: string;
  closeModal: () => void;
}

export const ImageModal: React.FC<Props> = ({url, closeModal}) => (
  <>
    <ModalBackground onClick={closeModal}/>

    <Wrapper>
      <Image src={url} alt="Modal image"/>
    </Wrapper>
  </>
);

const Wrapper = styled.div`
  max-width: 70%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  background-color: #FFFFFF;
`;
import React, {useState} from "react";
import styled from "styled-components";

export const useModal = () => {
  const [isModalOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {isModalOpen, openModal, closeModal};
};

export interface ModalProps {
  closeModal: () => void;
}

export const Modal: React.FC<ModalProps> = ({children, closeModal}) => (
  <>
    <ModalBackground onClick={closeModal}/>
    <Wrapper>{children}</Wrapper>
  </>
);

const ModalBackground = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(25, 25, 25, 0.7);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
`;
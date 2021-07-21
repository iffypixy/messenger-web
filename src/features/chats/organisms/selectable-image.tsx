import React, {ImgHTMLAttributes} from "react";
import styled from "styled-components";

import {Modal, ModalProps, useModal} from "@lib/modal";

interface ImageModalProps extends ModalProps {
  url: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({closeModal, url}) => (
  <Modal closeModal={closeModal}>
    <ModalImg src={url}/>
  </Modal>
);

const ModalImg = styled.img`
  display: block;
  max-width: 65rem;
  max-height: 65rem;
`;

interface SelectableImageProps extends ImgHTMLAttributes<HTMLImageElement> {
}

export const SelectableImage: React.FC<SelectableImageProps> = (props) => {
  const {openModal, closeModal, isModalOpen} = useModal();

  return (
    <>
      {isModalOpen && <ImageModal closeModal={closeModal} url={props.src!}/>}
      <SelectableImg onClick={openModal} {...props} />
    </>
  );
};

const SelectableImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
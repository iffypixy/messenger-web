import React, {ImgHTMLAttributes, useState} from "react";
import styled from "styled-components";
import Modal from "react-modal";

import {customStyles} from "@lib/modal";

interface SelectableImageProps extends ImgHTMLAttributes<HTMLImageElement> {
}

export const SelectableImage: React.FC<SelectableImageProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SelectableImg onClick={() => setIsOpen(true)} {...props} />

      <Modal
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}>
        <ModalImg src={props.src}/>
      </Modal>
    </>
  );
};

const SelectableImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: #FFFFFF;
`;

const ModalImg = styled.img`
  display: block;
  max-width: 65rem;
  max-height: 65rem;
  background-color: #FFFFFF;
`;

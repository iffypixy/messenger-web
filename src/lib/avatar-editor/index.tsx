import React, {useState} from "react";
import Editor, {AvatarEditorProps as EditorProps} from "react-avatar-editor";
import styled from "styled-components";

import {ModalProps, Modal} from "@lib/modal";
import {Col, Row} from "@lib/layout";
import {H4, Button, Slider} from "@ui/atoms";

let editor: Editor | null = null;

export interface AvatarEditorModalProps extends EditorProps, ModalProps {
  title: string;
  handleSave: (blob: Blob) => void;
}

export const AvatarEditorModal: React.FC<AvatarEditorModalProps> = ({closeModal, handleSave, title, ...props}) => {
  const [scale, setScale] = useState(1);

  const handleSaveButtonClick = () => {
    if (editor) editor.getImage().toBlob((blob) => {
      if (blob) handleSave(blob);
    });
  };

  return (
    <Modal closeModal={closeModal}>
      <Wrapper>
        <H4>{title}</H4>

        <Editor ref={(element) => editor = element} scale={scale} {...props} />

        <Settings>
          <Slider onChange={({currentTarget}) => setScale(Number(currentTarget.value))}
                  value={scale} min={1} max={2} step={0.1} name="scale"/>
        </Settings>

        <Footer>
          <Button onClick={closeModal} small>Cancel</Button>
          <Button onClick={handleSaveButtonClick} small>Save</Button>
        </Footer>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled(Col).attrs(() => ({
  gap: "3rem"
}))`
   background-color: ${({theme}) => theme.palette.primary.main};
   border-radius: 1rem;
   padding: 2rem;
`;

const Settings = styled.div`
  padding: 0 4rem;
`;

const Footer = styled(Row).attrs(() => ({
  width: "100%",
  justify: "flex-end",
  align: "center",
  gap: "2rem",
  padding: "2rem 0 0 0"
}))`
  border-top: 2px solid ${({theme}) => theme.palette.divider};
`;
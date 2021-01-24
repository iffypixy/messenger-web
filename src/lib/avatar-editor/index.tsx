import React, {useState} from "react";
import styled from "styled-components";
import ReactAvatarEditor, {AvatarEditorProps} from "react-avatar-editor";

import {Button, H4, Slider} from "@ui/atoms";
import {Col, Row} from "@lib/layout";
import {ModalBackground} from "@ui/organisms";

interface Props extends AvatarEditorProps {
  title?: string;
  onSave: (blob: Blob) => any;
  onClose: () => void;
}

let editor: ReactAvatarEditor | null = null;

export const AvatarEditor: React.FC<Props> = ({title, onSave, onClose, ...props}) => {
  const [scale, setScale] = useState<number>(1);

  const handleRangeInputChange = ({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(currentTarget.value));
  };

  const handleSaveButtonClick = () => {
    if (editor) editor.getImage().toBlob((blob) => {
      if (blob) onSave(blob);
    });
  };

  return (
    <>
      <ModalBackground onClick={onClose}/>

      <Wrapper gap="2rem">
        {title && <H4>{title}</H4>}

        <ReactAvatarEditor ref={(element) => editor = element} {...props} scale={scale}/>

        <Settings>
          <Slider min={1} max={2} step={0.1} name="scale"
                  onChange={handleRangeInputChange} value={scale}/>
        </Settings>

        <Footer>
          <Row gap="2rem">
            <Button small onClick={onClose}>Cancel</Button>
            <Button small onClick={handleSaveButtonClick}>Save</Button>
          </Row>
        </Footer>
      </Wrapper>
    </>
  );
};

const Wrapper = styled(Col)`
  background-color: ${({theme}) => theme.palette.primary.dark};
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
`;

const Settings = styled.div`
  padding: 0 4rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 2px solid ${({theme}) => theme.palette.primary.main};
  padding-top: 2rem;
`;
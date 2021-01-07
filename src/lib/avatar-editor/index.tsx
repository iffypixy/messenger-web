import React from "react";
import styled from "styled-components";
import ReactAvatarEditor, {AvatarEditorProps} from "react-avatar-editor";

interface Props extends AvatarEditorProps {}

export const AvatarEditor: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <ReactAvatarEditor {...props} />

      <Settings>
        <input />
      </Settings>
    </Wrapper>
  )
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({theme}) => theme.palette.primary.dark};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
`;

const Settings = styled.div`
  padding: 1rem;
`;
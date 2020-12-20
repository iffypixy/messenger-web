import React from "react";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import styled from "styled-components";

import {chatDialogsSelectors} from "../features/dialogs";
import {Message} from "@api/dialog.api";
import {User} from "@api/auth.api";
import {Text, FormattedDate} from "@ui/atoms";
import {UserAvatar, UserName} from "@features/user";

export const ChatsList: React.FC = () => {
  const dialogs = Object.values(
    useSelector(chatDialogsSelectors.dialogsSelector)
  );

  console.log(dialogs);

  return (
    <List>
      {[...dialogs]
        .sort(
          (a, b) =>
            +new Date(a.latestMessage!.createdAt) -
            +new Date(b.latestMessage!.createdAt)
        )
        .map(({id, companion, messages}) => (
          <ChatsListItem
            key={id}
            companion={companion}
            message={messages![messages!.length - 1]}
          />
        ))}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > :not(:first-child) {
    margin-top: 2rem;  
  }
`;

interface ChatsListItemProps {
  message?: Message;
  companion: User;
}

const ChatsListItem: React.FC<ChatsListItemProps> = ({message, companion}) => (
  <ChatLink to={`/${companion.id}`}>
    <ItemWrapper>
      <ComponionAvatarWrapper>
        <UserAvatar src="https://cdn.dribbble.com/users/4255850/avatars/small/81daef4e2e469354c634e9c2b7bff9c2.jpg?1571229881" />
      </ComponionAvatarWrapper>

      <ItemContent>
        <UserName>{companion.firstName}</UserName>
        <Text>{message!.text}</Text>
      </ItemContent>

      <ItemInfo>
        <FormattedDate dateFormat="HH:mm">{new Date()}</FormattedDate>
      </ItemInfo>
    </ItemWrapper>
  </ChatLink>
);

const ItemWrapper = styled.div`
  width: 100%;
  display: flex;
  background-color: ${({theme}) => theme.palette.primary.main};
  border-radius: 5px;
  padding: 15px;
`;

const ComponionAvatarWrapper = styled.div`
  width: 65px;
  height: 65px;
`;

const ItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 70%;
  padding: 10px 0 10px 15px;
`;

const ItemInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  width: calc(30% - 65px);
`;

const ChatLink = styled(Link)`
  text-decoration: none;
`;

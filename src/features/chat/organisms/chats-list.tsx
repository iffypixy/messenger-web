import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import format from "date-fns/format";
import {Link, useParams} from "react-router-dom";

import {authSelectors} from "@features/auth";
import {Avatar, Icon, Text, RoundedNumber, Skeleton} from "@ui/atoms";
import {Col} from "@lib/layout";
import {ID} from "@api/common";
import {chatDialogsSelectors} from "../features/dialogs";
import {stringifyMessage} from "../lib";
import * as selectors from "../selectors";

interface Item {
  id: ID;
  path: string;
  title: string;
  avatar: string;
  text: string;
  info: React.ReactNode;
  date: Date;
  selected: boolean;
}

const DEFAULT_SKELETON_COUNT = 5;

export const ChatsList: React.FC = () => {
  const credentials = useSelector(authSelectors.credentialsSelector);
  const dialogs = useSelector(chatDialogsSelectors.listSelector);
  const search = useSelector(selectors.searchSelector);
  const areDialogsFetching = useSelector(chatDialogsSelectors.areDialogsFetchingSelector);

  const {companionId} = useParams<{companionId: ID}>();

  const mapDialogsToItems = (): Item[] => {
    return dialogs!.map(({id, companion, lastMessage, unreadMessagesNumber, status}) => {
      const selected = companion.id === companionId;
      const own = credentials!.id === lastMessage.sender.id;

      const info = unreadMessagesNumber ?
        <RoundedNumber digits={unreadMessagesNumber.toString().length} primary>{unreadMessagesNumber}</RoundedNumber> :
        own && <Icon name={lastMessage.isRead ? "double-check" : "check"} gray={!selected}/>;

      return {
        id, info, selected,
        path: `/${companion.id}`,
        title: companion.firstName,
        avatar: companion.avatar,
        date: new Date(lastMessage.createdAt),
        text: status || `${own ? "You: " : ""}${stringifyMessage(lastMessage)}`
      };
    });
  };

  return (
    <List gap="2rem">

      {dialogs && mapDialogsToItems()
        .sort((a, b) => +a.date - +b.date)
        .filter(({title}) => title.toLowerCase().startsWith(search.toLowerCase()))

        .map(({id, path, title, avatar, text, date, selected, info}) => (
            <ChatLink key={id} to={path}>
              <Wrapper selected={selected}>
                <ChatAvatar>
                  <Avatar src={avatar}/>
                </ChatAvatar>

                <Content>
                  <Text type="bold" space="nowrap" primary>{title}</Text>
                  <Text space="nowrap" primary={selected}>{text}</Text>
                </Content>

                <Information>
                  <Text primary={selected}>{format(date, "HH:mm")}</Text>

                  {info}
                </Information>
              </Wrapper>
            </ChatLink>
          )
        )}

      {areDialogsFetching && Array.from({length: DEFAULT_SKELETON_COUNT}, (_, idx) => (
        <Wrapper key={idx}>
          <ChatAvatar>
            <Skeleton.Avatar/>
          </ChatAvatar>

          <Content>
            <Skeleton.Text width="50%"/>
            <Skeleton.Text width="80%"/>
          </Content>

          <Information>
            <Skeleton.Text width="2rem"/>
            <Skeleton.Text width="2rem"/>
          </Information>
        </Wrapper>
      ))}
    </List>
  );
};

const List = styled(Col)`
  width: 100%;
`;

interface WrapperProps {
  selected?: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  width: 100%;
  display: flex;
  background-color: ${({theme, selected}) =>
  selected ? theme.palette.secondary.main : theme.palette.primary.main};
  border-radius: 5px;
  padding: 1.5rem;
`;

const ChatAvatar = styled.div`
  width: 6.5rem;
  height: 6.5rem;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 70%;
  padding: 1rem 0 1rem 1.5rem;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  width: calc(30% - 65px);
  padding: 1rem 0;
`;

const ChatLink = styled(Link)`
  text-decoration: none;
`;



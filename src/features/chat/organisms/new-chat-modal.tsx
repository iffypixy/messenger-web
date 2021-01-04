import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

import {Avatar, H4, Input, Text, Button, Skeleton, Icon} from "@ui/atoms";
import {Col, Row} from "@lib/layout";
import {useActions} from "@lib/hooks";
import {IUser} from "@api/common";
import * as actions from "../actions";
import * as selectors from "../selectors";

interface Props {
  closeModal: () => void;
}

const DEFAULT_SKELETON_LIST = 5;

let previousReqPromise: {abort: () => null} | null = null;

export const NewChatModal: React.FC<Props> = ({closeModal}) => {
  const [query, setQuery] = useState<string>("");
  const [user, setUser] = useState<IUser | null>(null);

  const history = useHistory();

  const {fetchNewUsers, setNewUsers} = useActions(actions);

  const users = useSelector(selectors.newUsersSelector);
  const areUsersFetching = useSelector(selectors.areNewUsersFetchingSelector);

  useEffect(() => {
    return () => {
      setNewUsers(null);
    };
  }, []);

  const handleInputChange = ({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(value);

    if (!value) return setNewUsers(null);

    if (previousReqPromise) previousReqPromise.abort();

    previousReqPromise = fetchNewUsers({query: value, take: 5});
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      closeModal();

      history.push(`/${user.id}`);
    }
  };

  return (
    <>
      <Wrapper onClick={closeModal}/>

      <Modal gap="2rem">
        <Title>New chat</Title>

        <form onSubmit={handleFormSubmit}>
          <Col gap="2rem">

            <InputWrapper>
              {user ? (
                <Item>
                  <UserAvatar>
                    <Avatar src={user.avatar}/>
                  </UserAvatar>

                  <Text type="bold" primary>{user.firstName}</Text>

                  <ItemIcon name="cross" onClick={() => setUser(null)}/>
                </Item>
              ) : (
                <>
                  <Col gap="1rem">
                    <Input value={query} onChange={handleInputChange} placeholder="Search new dialogs"/>

                    {users?.length === 0 && (
                      <Row width="100%" justify="center">
                        <Text>No users found</Text>
                      </Row>
                    )}
                  </Col>

                  <ListWrapper>

                    {(users?.length || areUsersFetching) && (
                      <List>
                        {users?.map((user) => (
                          <Item key={user.id} onClick={() => setUser(user)}>
                            <UserAvatar>
                              <Avatar src={user.avatar}/>
                            </UserAvatar>

                            <Text type="bold" primary>{user.firstName}</Text>
                          </Item>
                        ))}

                        {areUsersFetching && Array.from({length: DEFAULT_SKELETON_LIST}, (_, idx) => (
                          <Item key={idx}>
                            <UserAvatar>
                              <Skeleton.Avatar/>
                            </UserAvatar>

                            <Skeleton.Text width="10rem"/>
                          </Item>
                        ))}

                      </List>
                    )}
                  </ListWrapper>
                </>
              )}
            </InputWrapper>

            <Button type="submit" disabled={!user}>Add</Button>
          </Col>
        </form>
      </Modal>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Modal = styled(Col)`
  width: 20%;
  background-color: ${({theme}) => theme.palette.primary.dark};
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem;
`;

const Title = styled(H4)`
  text-align: center;
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const ListWrapper = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  padding-top: 1rem;
`;

const List = styled.div`
  width: 100%;
  background-color: ${({theme}) => theme.palette.primary.main};
  position: absolute;
  border-radius: 5px;
  box-shadow: 0 0 3px 1px #000000;
  
  & > :not(:first-child) {
    border-top: 2px solid ${({theme}) => theme.palette.primary.dark};
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
`;

const UserAvatar = styled.div`
  width: 4rem;
  height: 4rem;
  margin-right: 1rem;
`;

const ItemIcon = styled(Icon)`
  margin-left: auto;
`;

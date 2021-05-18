import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {directsActions, directsSelectors} from "@features/directs";
import {groupsActions, groupsSelectors} from "@features/groups";
import {ID} from "@lib/typings";

export const GroupPage = () => {
  const dispatch = useDispatch();

  const directChats = useSelector(directsSelectors.chats);
  const areDirectChatsFetching = useSelector(directsSelectors.areChatsFetching);

  const groupChats = useSelector(groupsSelectors.chats);
  const areGroupChatsFetching = useSelector(groupsSelectors.areChatsFetching);

  const toFetchDirectChats = !directChats && !areDirectChatsFetching;
  const toFetchGroupChats = !groupChats && !areGroupChatsFetching;

  useEffect(() => {
    if (toFetchDirectChats) dispatch(directsActions.fetchChats());
    if (toFetchGroupChats) dispatch(groupsActions.fetchChats());
  }, []);

  const {id} = useParams<{id: ID}>();

  const groupChat = useSelector(groupsSelectors.chat);
  const isGroupChatFetching = useSelector(groupsSelectors.isChatFetching);

  const toFetchGroupChat = !groupChat && !isGroupChatFetching;

  useEffect(() => {
    if (toFetchGroupChat) dispatch(groupsActions.fetchChat({id}));
  }, []);
};
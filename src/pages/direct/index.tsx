import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import {directsSelectors, directsActions} from "@features/directs";
import {groupsSelectors} from "@features/groups";
import {ID} from "@lib/typings";

export const DirectPage = () => {
  const dispatch = useDispatch();

  const directChats = useSelector(directsSelectors.chats);
  const areDirectChatsFetching = useSelector(directsSelectors.areChatsFetching);

  const groupChats = useSelector(groupsSelectors.chats);
  const areGroupChatsFetching = useSelector(groupsSelectors.areChatsFetching);

  const toFetchDirectChats = !directChats && !areDirectChatsFetching;
  const toFetchGroupChats = !groupChats && !areGroupChatsFetching;

  useEffect(() => {
    if (toFetchDirectChats) dispatch(directsActions.fetchChats());
    if (toFetchGroupChats) dispatch(directsActions.fetchChats());
  }, []);

  const {partnerId} = useParams<{partnerId: ID}>();

  const directChat = useSelector(directsSelectors.chat);
  const isDirectChatFetching = useSelector(directsSelectors.isChatFetching);

  const toFetchDirectChat = !directChat && !isDirectChatFetching;

  useEffect(() => {
    if (toFetchDirectChat) dispatch(directsActions.fetchChat({partnerId}));
  }, []);
};
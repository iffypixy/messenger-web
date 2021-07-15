import {useEffect} from "react";
import {useSelector} from "react-redux";
import {unwrapResult} from "@reduxjs/toolkit";

import {directsActions, directsSelectors} from "@features/directs";
import {groupsActions, groupsSelectors, groupsServerEvents} from "@features/groups";
import {useRootDispatch} from "@lib/store";
import {socket} from "@lib/socket";

export const useFetchingChats = () => {
  const dispatch = useRootDispatch();

  const directs = useSelector(directsSelectors.chats);
  const groups = useSelector(groupsSelectors.chats);
  const areDirectsFetching = useSelector(directsSelectors.areChatsFetching);
  const areGroupsFetching = useSelector(groupsSelectors.areChatsFetching);

  const toFetchDirects = !directs && !areDirectsFetching;
  const toFetchGroups = !groups && !areGroupsFetching;

  useEffect(() => {
    if (toFetchDirects) {
      dispatch(directsActions.fetchChats());
    }

    if (toFetchGroups) {
      dispatch(groupsActions.fetchChats())
        .then(unwrapResult)
        .then(({chats}) => {
          socket.emit(groupsServerEvents.SUBSCRIBE, {
            groupsIds: chats.map(({id}) => id)
          });
        });
    }
  }, []);
};
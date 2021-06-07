import {useEffect} from "react";
import {useSelector} from "react-redux";

import {directsActions, directsSelectors} from "@features/directs";
import {groupsActions, groupsSelectors} from "@features/groups";
import {useRootDispatch} from "@lib/store";

export const useFetchingChats = () => {
  const dispatch = useRootDispatch();

  const directs = useSelector(directsSelectors.chats);
  const areDirectsFetching = useSelector(directsSelectors.areChatsFetching);

  const groups = useSelector(groupsSelectors.chats);
  const areGroupsFetching = useSelector(groupsSelectors.areChatsFetching);

  const toFetchDirect = !directs && !areDirectsFetching;
  const toFetchGroup = !groups && !areGroupsFetching;

  useEffect(() => {
    if (toFetchDirect) dispatch(directsActions.fetchChats());
    if (toFetchGroup) dispatch(groupsActions.fetchChats());
  }, []);
};
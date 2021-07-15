import React from "react";
import {useSelector} from "react-redux";

import {chatsActions, chatsSelectors} from "@features/chats";
import {usersActions} from "@features/users";
import {useRootDispatch} from "@lib/store";
import {Input} from "@ui/atoms";

export const SearchBar: React.FC = () => {
  const dispatch = useRootDispatch();

  const search = useSelector(chatsSelectors.search);

  const handleChange = ({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
    const value = currentTarget.value;

    dispatch(chatsActions.setSearch({
      search: value
    }));

    if (!!value) {
      dispatch(usersActions.fetchSearchingUsers({
        query: value
      }));
    } else {
      dispatch(usersActions.setSearching({
        searching: []
      }));
    }
  };

  return (
    <Input
      placeholder="Search chat"
      onChange={handleChange}
      value={search}/>
  );
};
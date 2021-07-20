import {combineReducers} from "@reduxjs/toolkit";

import {chatsReducer} from "@features/chats";
import {authReducer} from "@features/auth";
import {directsReducer} from "@features/directs";
import {groupsReducer} from "@features/groups";
import {usersReducer} from "@features/users";
import {profilesReducer} from "@features/profiles";
import {themingReducer} from "@lib/theming";

export const rootReducer = combineReducers({
  theming: themingReducer,
  auth: authReducer,
  directs: directsReducer,
  groups: groupsReducer,
  chats: chatsReducer,
  users: usersReducer,
  profiles: profilesReducer
});
import {createReducer, PayloadAction, Reducer} from "@reduxjs/toolkit";

import {User} from "@api/common";
import * as actions from "../actions";

interface InitialState {
    search: string;
    queriedUsers: User[] | null;
}

export const dataReducer: Reducer<InitialState> = createReducer<InitialState>(
    {
        search: "",
        queriedUsers: null
    },
    {
        [actions.setSearch.type]: (state, {payload}: PayloadAction<{search: string}>) => {
            state.search = payload.search;
        },

        [actions.fetchQueriedUsers.fulfilled.type]: (state, {payload}: PayloadAction<{users: User[]}>) => {
            state.queriedUsers = payload.users;
        },

        [actions.setQueriedUsers.type]: (state, {payload}: PayloadAction<{users: User[]}>) => {
            state.queriedUsers = payload.users;
        }
    }
);
import {createReducer, PayloadAction, Reducer} from "@reduxjs/toolkit";

import {IUser} from "@api/common";
import * as actions from "../actions";

interface InitialState {
    search: string;
    queriedUsers: IUser[] | null;
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

        [actions.fetchQueriedUsers.fulfilled.type]: (state, {payload}: PayloadAction<{users: IUser[]}>) => {
            state.queriedUsers = payload.users;
        },

        [actions.setQueriedUsers.type]: (state, {payload}: PayloadAction<{users: IUser[]}>) => {
            state.queriedUsers = payload.users;
        }
    }
);
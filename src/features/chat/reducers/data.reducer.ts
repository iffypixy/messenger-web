import {createReducer, PayloadAction, Reducer} from "@reduxjs/toolkit";

import {IUser} from "@api/common";
import * as actions from "../actions";

interface InitialState {
    search: string;
    newUsers: IUser[] | null;
}

export const dataReducer: Reducer<InitialState> = createReducer<InitialState>(
    {
        search: "",
        newUsers: null
    },
    {
        [actions.setSearch.type]: (state, {payload}: PayloadAction<string>) => {
            state.search = payload;
        },

        [actions.fetchNewUsers.fulfilled.type]: (state, {payload}: PayloadAction<{users: IUser[]}>) => {
            state.newUsers = payload.users;
        },

        [actions.setNewUsers.type]: (state, {payload}: PayloadAction<IUser[]>) => {
            state.newUsers = payload;
        }
    }
);
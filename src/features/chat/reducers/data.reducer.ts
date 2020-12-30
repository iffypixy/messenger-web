import {createReducer, PayloadAction} from "@reduxjs/toolkit";

import * as actions from "../actions";

interface InitialState {
    search: string;
}

export const dataReducer = createReducer<InitialState>(
    {
        search: ""
    },
    {
        [actions.setSearch.type]: (state, {payload}: PayloadAction<string>) => {
            state.search = payload;
        }
    }
);
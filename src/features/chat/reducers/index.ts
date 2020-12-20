import {combineReducers} from "redux";

import {dataReducer} from "./data.reducer";
import {chatDialogsReducer} from "../features/dialogs";

export const reducer = combineReducers({
    data: dataReducer,
    dialogs: chatDialogsReducer
});
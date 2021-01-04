import {combineReducers} from "redux";

import {dataReducer} from "./data.reducer";
import {loadingReducer} from "./loading.reducer";
import {chatDialogsReducer} from "../features/dialogs";

export const reducer = combineReducers({
    data: dataReducer,
    loading: loadingReducer,
    dialogs: chatDialogsReducer
});
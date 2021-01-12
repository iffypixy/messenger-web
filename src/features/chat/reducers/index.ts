import {combineReducers} from "redux";

import {dataReducer} from "./data.reducer";
import {loadingReducer} from "./loading.reducer";
import {chatDialogsReducer} from "../features/dialogs";
import {chatDiscussionsReducer} from "../features/discussions";

export const reducer = combineReducers({
    data: dataReducer,
    loading: loadingReducer,
    dialogs: chatDialogsReducer,
    discussions: chatDiscussionsReducer
});
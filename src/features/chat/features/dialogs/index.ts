import {reducer} from "./reducers";
import {DialogForm, DialogHeader, MessagesList} from "./organisms";
import * as actions from "./actions";
import * as selectors from "./selectors";

export {
    DialogForm, DialogHeader, MessagesList,
    reducer as chatDialogsReducer,
    actions as chatDialogsActions,
    selectors as chatDialogsSelectors
};
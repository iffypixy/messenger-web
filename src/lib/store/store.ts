import {createStore} from "@reduxjs/toolkit";

import {rootReducer} from "./root-reducer";

export const store = createStore(rootReducer);
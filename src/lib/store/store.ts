import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";

import {rootReducer} from "./root-reducer";

export const store = configureStore({
  reducer: rootReducer
});

type RootDispatch = typeof store.dispatch;

export const useRootDispatch = () => useDispatch<RootDispatch>();
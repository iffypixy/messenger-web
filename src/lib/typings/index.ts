import {store} from "@lib/store";

export type RootState = ReturnType<typeof store.getState>;

export type ID = string;
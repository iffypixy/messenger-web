import {store} from "@lib/store";

export type RootState = ReturnType<typeof store.getState>;

export type ID = string;

export interface File {
  id: ID;
  name: string;
  size: number;
  url: string;
}
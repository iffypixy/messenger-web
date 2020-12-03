import {rootReducer} from "@lib/store";

declare module "redux" {
  export type AppState = ReturnType<typeof rootReducer>;
}
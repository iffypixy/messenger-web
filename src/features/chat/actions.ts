import {createAction} from "@reduxjs/toolkit";

const typePrefix = "chat";

export const setSearch = createAction(`${typePrefix}/setSearch`);

import {createAction} from "@reduxjs/toolkit";

const typePrefix = "user";

export const setOnlineUsersIds = createAction(`${typePrefix}/setOnlineUsersIds`);
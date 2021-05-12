import {createAction} from "@reduxjs/toolkit";

const type = "theming";

export const toggleTheme = createAction(`${type}/toggleTheme`);

export const changeTheme = createAction(`${type}/changeTheme`);
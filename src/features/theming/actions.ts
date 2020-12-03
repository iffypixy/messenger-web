import {createAction} from "@reduxjs/toolkit";

const typePrefix = "theming";

export const setTheme = createAction(`${typePrefix}/setTheme`);
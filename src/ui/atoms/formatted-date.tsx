import React from "react";
import {format} from "date-fns";

import {Text} from "./text";

interface Props {
    children: Date;
    dateFormat: string;
}

export const FormattedDate: React.FC<Props> = ({children, dateFormat}) => <Text>{format(children, dateFormat)}</Text>;
import {ID} from "@lib/typings";

export interface Credentials {
    id: ID;
    username: string;
    avatar: string;
    lastSeen: Date;
}
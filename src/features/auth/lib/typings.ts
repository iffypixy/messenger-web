import {ID} from "@lib/typings";

export interface Credentials {
    id: ID;
    username: string;
    avatar: string;
    isOnline: boolean;
    lastSeen: Date;
}
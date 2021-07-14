import {File, ID} from "@lib/typings";

export interface AttachedAudio {
  id: ID;
  url: string;
  createdAt: string;
}

export interface AttachedImage {
  id: ID;
  url: string;
  createdAt: string;
}

export interface AttachedFile {
  id: ID;
  file: File;
  createdAt: string;
}
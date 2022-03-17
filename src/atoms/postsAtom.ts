import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  communityId: string;
  userDisplayText: string;
  creatorId: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: 0;
  createdAt: Timestamp;
  editedAt: Timestamp;
}

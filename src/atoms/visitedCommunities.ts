import { FieldValue, Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
  id?: string;
  creatorId: string;
  createdAt: Timestamp;
  numberOfMembers: number;
}

interface VisitedCommunitiesState {
  [key: string]: Community;
}

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

export const visitedCommunitiesState = atom<VisitedCommunitiesState>({
  key: "visitedCommunitiesState",
  default: {},
});

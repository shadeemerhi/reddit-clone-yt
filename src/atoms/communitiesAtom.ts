import { atom } from "recoil";
import { FieldValue, Timestamp } from "firebase/firestore";

export interface Community {
  id: string;
  creatorId: string;
  createdAt: Timestamp;
  numberOfMembers: number;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
}

interface CommunitiesState {
  [key: string]:
    | CommunitySnippet[]
    | { [key: string]: Community }
    | Community
    | undefined;
  mySnippets: CommunitySnippet[];
  visitedCommunities: {
    [key: string]: Community;
  };
  currentCommunity?: Community;
}

export const defaultCommunitiesState: CommunitiesState = {
  mySnippets: [],
  visitedCommunities: {},
  currentCommunity: undefined,
};

export const communitiesState = atom<CommunitiesState>({
  key: "communitiesState",
  default: defaultCommunitiesState,
});

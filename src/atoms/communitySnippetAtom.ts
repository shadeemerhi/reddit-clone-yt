import { atom } from "recoil";

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
}

export interface CommunitySnippetState {
  myCommunities: CommunitySnippet[];
  searchResults: CommunitySnippet[];
  recommended: CommunitySnippet[];
}

const defaultSnippetState: CommunitySnippetState = {
  myCommunities: [],
  searchResults: [],
  recommended: [],
};

export const communitySnippetState = atom({
  key: "communitySnippetState",
  default: defaultSnippetState,
});

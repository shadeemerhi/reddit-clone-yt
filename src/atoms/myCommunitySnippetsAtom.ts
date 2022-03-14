import { atom } from "recoil";

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
}

const defaultSnippetState: CommunitySnippet[] = [];

export const myCommunitySnippetState = atom({
  key: "myCommunitySnippetsState",
  default: defaultSnippetState,
});

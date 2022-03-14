import { atom } from "recoil";

export interface Community {
  id: string;
  creatorId: string;
}

export const visitedCommunitiesState = atom({
  key: "visitedCommunitiesState",
  default: [] as Community[],
});

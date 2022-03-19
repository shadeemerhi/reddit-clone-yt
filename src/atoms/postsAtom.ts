import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export type Post = {
  id: string;
  communityId: string;
  userDisplayText: string; // change to authorDisplayText
  creatorId: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  currentUserVoteStatus?: {
    id: string;
    voteValue: number;
  };
  postIdx?: number;
  createdAt?: Timestamp;
  editedAt?: Timestamp;
};

export type PostVote = {
  id?: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
  votesAddedToPosts: boolean;
  votesFetched: boolean;
  postsCache: {
    [key: string]: Post[];
  };
}

export const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
  votesAddedToPosts: false,
  votesFetched: false,
  postVotes: [],
  postsCache: {},
};

export const postState = atom({
  key: "postState",
  default: defaultPostState,
});

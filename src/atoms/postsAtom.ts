import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export type Post = {
  id: string;
  communityId: string;
  userDisplayText: string;
  creatorId: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: 0;
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
  //   postCache: {
  //     [key: string]: Post[];
  //   };
  postsCache: {
    [key: string]: {
      posts: Post[];
      postVotes: PostVote[];
    };
  };
}

export const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
  postsCache: {},
};

export const postState = atom({
  key: "postState",
  default: defaultPostState,
});

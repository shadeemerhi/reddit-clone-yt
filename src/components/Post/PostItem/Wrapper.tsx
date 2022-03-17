import React from "react";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { Post } from "../../../atoms/communitiesAtom";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoArrowRedoOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import moment from "moment";
import Link from "next/link";
import PostItemContent from "./Content";

type PostItemWrapperProps = {
  post: Post;
  link?: boolean;
  onVote: (post: Post, vote: number) => void;
  userVoteValue?: number;
  communityId: string;
};

const PostItemWrapper: React.FC<PostItemWrapperProps> = ({
  post,
  link,
  onVote,
  userVoteValue,
  communityId,
}) => {
  return (
    <Link href={`${communityId}/comments/${post.id}`}>
      <PostItemContent
        key={post.id}
        post={post}
        onVote={onVote}
        // userVoteValue={
        //   postVotes.find((item) => item.postId === post.id)?.voteValue
        // }
        communityId={communityId}
      />
    </Link>
  );
};
export default PostItemWrapper;

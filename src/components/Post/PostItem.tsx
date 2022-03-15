import { Flex } from "@chakra-ui/react";
import React from "react";
import { Post } from "../../atoms/visitedCommunities";

type PostItemProps = {
  post: Post;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return <Flex>{post.title}</Flex>;
};
export default PostItem;

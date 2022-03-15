import { Flex } from "@chakra-ui/react";
import React from "react";
import { Post } from "../../atoms/visitedCommunities";

type PostItemProps = {
  post: Post;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <Flex
      border="1px solid"
      borderColor="gray.300"
      borderRadius={4}
      bg="white"
      //   p={2}
    >
      <Flex bg="gray.100" p={2}>
        hey
      </Flex>
      <Flex flexGrow={10} p={2}>
        {post.body}
      </Flex>
    </Flex>
  );
};
export default PostItem;

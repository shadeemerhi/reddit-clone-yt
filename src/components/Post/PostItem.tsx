import React from "react";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { Post } from "../../atoms/communitiesAtom";
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

type PostItemProps = {
  post: Post;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <Flex border="1px solid" borderColor="gray.300" borderRadius={4} bg="white">
      <Flex
        direction="column"
        align="center"
        bg="gray.100"
        p={2}
        borderRadius="3px 0px 0px 3px"
      >
        <Icon
          as={IoArrowUpCircleOutline}
          color="gray.400"
          fontSize={20}
          cursor="pointer"
        />
        {post.voteStatus}
        <Icon
          as={IoArrowDownCircleOutline}
          color="gray.400"
          fontSize={20}
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column">
        <Stack spacing={1} p="10px 10px">
          <Text fontSize="9pt" color="gray.500">
            Posted by u/{post.userDisplayText}{" "}
            {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
          </Text>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.body}</Text>
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments} Comments</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Saved</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;

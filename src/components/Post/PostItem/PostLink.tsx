import React from "react";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { BsChat } from "react-icons/bs";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { PostItemContentProps } from ".";

const PostItemLink: React.FC<PostItemContentProps> = ({
  post,
  onVote,
  userVoteValue,
  communityId,
}) => {
  return (
    <Link href={`/r/${communityId}/comments/${post.id}`}>
      <Flex
        border="1px solid"
        borderColor="gray.300"
        borderRadius={4}
        bg="white"
        cursor="pointer"
        _hover={{ borderColor: "gray.500" }}
      >
        <Flex
          direction="column"
          align="center"
          bg="gray.100"
          p={2}
          borderRadius="3px 0px 0px 3px"
        >
          <Icon
            as={
              userVoteValue === 1
                ? IoArrowUpCircleSharp
                : IoArrowUpCircleOutline
            }
            color={userVoteValue === 1 ? "brand.100" : "gray.400"}
            fontSize={22}
            cursor="pointer"
            onClick={() => onVote(post, 1)}
          />
          {post.voteStatus}
          <Icon
            as={
              userVoteValue === -1
                ? IoArrowDownCircleSharp
                : IoArrowDownCircleOutline
            }
            color={userVoteValue === -1 ? "#4379FF" : "gray.400"}
            fontSize={22}
            cursor="pointer"
            onClick={() => onVote(post, -1)}
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
              <Text fontSize="9pt">{post.numberOfComments}</Text>
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
    </Link>
  );
};
export default PostItemLink;

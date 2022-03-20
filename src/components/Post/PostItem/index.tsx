import React, { ReactPropTypes } from "react";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { BsChat } from "react-icons/bs";
import {
  IoArrowUpCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowDownCircleOutline,
  IoArrowRedoOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Post } from "../../../atoms/postsAtom";

export type PostItemContentProps = {
  post: Post;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number
  ) => void;
  postIdx?: number;
  onSelectPost?: (value: Post, postIdx: number) => void;
  userVoteValue?: number;
};

const PostItem: React.FC<PostItemContentProps> = ({
  post,
  postIdx,
  onVote,
  onSelectPost,
  userVoteValue,
}) => {
  const onCommunityPage = !!onSelectPost; // function not passed on [pid] page
  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={onCommunityPage ? "gray.300" : "white"}
      borderRadius={onCommunityPage ? 4 : "4px 4px 0px 0px"}
      cursor={onCommunityPage ? "pointer" : "unset"}
      _hover={{ borderColor: onCommunityPage ? "gray.500" : "none" }}
      onClick={() =>
        onSelectPost && post ? onSelectPost(post, postIdx!) : null
      }
    >
      <Flex
        direction="column"
        align="center"
        bg={onCommunityPage ? "gray.100" : "none"}
        p={2}
        borderRadius={onCommunityPage ? "3px 0px 0px 3px" : "0"}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : "gray.400"}
          fontSize={22}
          cursor="pointer"
          onClick={(event) => onVote(event, post, 1)}
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
          onClick={(event) => onVote(event, post, -1)}
        />
      </Flex>
      <Flex direction="column">
        <Stack spacing={1} p="10px 10px">
          {post.createdAt && (
            <Text fontSize="9pt" color="gray.500">
              Posted by u/{post.userDisplayText}{" "}
              {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          )}
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
  );
};

export default PostItem;

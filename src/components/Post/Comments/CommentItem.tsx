import React from "react";
import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

export type Comment = {
  id?: string;
  authorId: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt?: Timestamp;
};

type CommentItemProps = {
  comment: Comment;
};

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <Flex>
      <Box mr={2}>
        <Icon />
      </Box>
      <Flex direction="column">
        <Stack direction="row" spacing={1} fontSize="8pt">
          <Text fontWeight={700}>{comment.authorId}</Text>
          {comment.createdAt?.seconds && (
            <Text color="gray.600">
              {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          )}
        </Stack>
        <Text>{comment.text}</Text>
      </Flex>
    </Flex>
  );
};
export default CommentItem;

import React, { useCallback, useState } from "react";
import {
  Avatar,
  background,
  Box,
  Flex,
  Icon,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { doc, increment, Timestamp, writeBatch } from "firebase/firestore";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
} from "react-icons/io5";

import moment from "moment";
import { firestore } from "../../../firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { Post, postState } from "../../../atoms/postsAtom";

export type Comment = {
  id?: string;
  creatorId: string;
  creatorDisplayText: string;
  creatorPhotoURL: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt?: Timestamp;
};

type CommentItemProps = {
  comment: Comment;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  userId?: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  setComments,
  userId,
}) => {
  const [loading, setLoading] = useState(false);
  const setPostState = useSetRecoilState(postState);

  const onDeleteComment = useCallback(async () => {
    setLoading(true);
    try {
      if (!comment.id) throw "Comment has no ID";
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      batch.update(doc(firestore, "posts", comment.postId), {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
        postUpdateRequired: true,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.log("Error deletig comment", error.message);
    }
  }, [setComments, setPostState]);

  return (
    <Flex>
      <Box mr={2}>
        {comment.creatorPhotoURL ? (
          <Avatar
            size="xs"
            name="Kola Tioluwani"
            src="https://bit.ly/tioluwani-kolawole"
          />
        ) : (
          <Icon as={FaReddit} fontSize={30} color="gray.300" />
        )}
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" spacing={2} fontSize="8pt">
          <Text
            fontWeight={700}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {comment.creatorDisplayText}
          </Text>
          {comment.createdAt?.seconds && (
            <Text color="gray.600">
              {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          )}
          {loading && <Spinner size="sm" />}
        </Stack>
        <Text fontSize="10pt">{comment.text}</Text>
        <Stack
          direction="row"
          align="center"
          cursor="pointer"
          fontWeight={600}
          color="gray.500"
        >
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {userId === comment.creatorId && (
            <>
              <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                Edit
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={onDeleteComment}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
export default CommentItem;

import React, { useState } from "react";
import { Box, Flex, Textarea, Text, Button } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { postState } from "../../../atoms/postsAtom";
import CommentInput from "./Input";

type CommentsProps = {
  pid: string;
  community: string;
};

type Comment = {
  id?: string;
  authorId: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt?: Timestamp;
};

const Comments: React.FC<CommentsProps> = ({ pid, community }) => {
  const [user] = useAuthState(auth);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const postItemState = useRecoilValue(postState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onCreateComment = async (comment: string) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      // Create comment document
      const commentDocRef = doc(collection(firestore, "comments"));
      batch.set(commentDocRef, {
        postId: postItemState.selectedPost?.id,
        authorId: user.uid,
        communityId: community,
        text: comment,
        postTitle: postItemState.selectedPost?.title,
        createdAt: serverTimestamp(),
      });

      // Update post numberOfComments
      batch.update(doc(firestore, "posts", postItemState.selectedPost!.id), {
        numberOfComments: increment(1),
      });
      await batch.commit();

      setComment("");
      //   setComments((prev) => [{ title: comment }, ...prev]);
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setLoading(false);
  };

  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex direction="column" pl={10} pr={4} fontSize="10pt" width="100%">
        <CommentInput
          comment={comment}
          setComment={setComment}
          loading={loading}
          user={user}
          onCreateComment={onCreateComment}
        />
        {comments.map((item: any) => (
          <span>{item.title}</span>
        ))}
      </Flex>
    </Box>
  );
};
export default Comments;

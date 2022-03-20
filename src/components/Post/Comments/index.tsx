import React, { useEffect, useState } from "react";
import { Box, Flex, Stack } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { Post, postState } from "../../../atoms/postsAtom";
import { auth, firestore } from "../../../firebase/clientApp";
import CommentItem, { Comment } from "./CommentItem";
import CommentInput from "./Input";

type CommentsProps = {
  selectedPost: Post;
  community: string;
};

const Comments: React.FC<CommentsProps> = ({ selectedPost, community }) => {
  const [user] = useAuthState(auth);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostItemState = useSetRecoilState(postState);

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
        postId: selectedPost.id,
        authorId: user.uid,
        communityId: community,
        text: comment,
        postTitle: selectedPost.title,
        createdAt: serverTimestamp(),
      });

      // Update post numberOfComments
      batch.update(doc(firestore, "posts", selectedPost.id), {
        numberOfComments: increment(1),
      });
      await batch.commit();

      setComment("");
      const { id: postId, title } = selectedPost;
      setComments((prev) => [
        {
          id: commentDocRef.id,
          authorId: user.uid,
          communityId: community,
          postId,
          postTitle: title,
          text: comment,
          createdAt: {
            seconds: Date.now() / 1000,
          },
        } as Comment,
        ...prev,
      ]);

      // Fetch posts again to update number of comments
      setPostItemState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
        postUpdateRequired: true,
      }));
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setLoading(false);
  };

  const getPostComments = async () => {
    setLoading(true);
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    // get comments
    getPostComments();
  }, []);

  console.log("HERE ARE COMMENTS", comments);

  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          comment={comment}
          setComment={setComment}
          loading={loading}
          user={user}
          onCreateComment={onCreateComment}
        />
      </Flex>
      <Stack spacing={6} p={2}>
        {comments.map((item: Comment) => (
          <CommentItem key={item.id} comment={item} />
        ))}
      </Stack>
    </Box>
  );
};
export default Comments;

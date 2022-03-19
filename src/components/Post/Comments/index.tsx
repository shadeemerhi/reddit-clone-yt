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
  writeBatch,
} from "firebase/firestore";
import { postState } from "../../../atoms/postsAtom";

type CommentsProps = {
  pid: string;
  community: string;
};

type Comment = {
  title: string;
};

const Comments: React.FC<CommentsProps> = ({ pid, community }) => {
  const [user] = useAuthState(auth);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    { title: "hey dude this is a comment" },
  ]);
  const [loading, setLoading] = useState(false);
  const postItemState = useRecoilValue(postState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onCreateComment = async () => {
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
      setComments((prev) => [{ title: comment }, ...prev]);
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setLoading(false);
  };

  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex direction="column" pl={10} pr={4} fontSize="10pt" width="100%">
        <Flex direction="column" position="relative">
          <Text mb={1}>
            Comment as{" "}
            <span style={{ color: "#3182CE" }}>
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={comment}
            position="relative"
            onChange={(event) => setComment(event.target.value)}
            placeholder="What are your thoughts?"
            fontSize="10pt"
            borderRadius={4}
            minHeight="160px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid black",
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
              disabled={!comment.length}
              isLoading={loading}
              onClick={onCreateComment}
            >
              Comment
            </Button>
          </Flex>
        </Flex>
        {comments.map((item: any) => (
          <span>{item.title}</span>
        ))}
      </Flex>
    </Box>
  );
};
export default Comments;

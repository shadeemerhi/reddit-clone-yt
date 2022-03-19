import React, { MouseEventHandler, useState } from "react";
import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";

type CommentInputProps = {
  comment: string;
  setComment: (value: string) => void;
  loading: boolean;
  user?: User | null;
  onCreateComment: (comment: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
  comment,
  setComment,
  loading,
  user,
  onCreateComment,
}) => {
  //   const [comment, setComment] = useState("");
  return (
    <Flex direction="column" position="relative">
      <Text mb={1}>
        Comment as{" "}
        <span style={{ color: "#3182CE" }}>{user?.email?.split("@")[0]}</span>
      </Text>
      <Textarea
        value={comment}
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
          onClick={() => onCreateComment}
        >
          Comment
        </Button>
      </Flex>
    </Flex>
  );
};
export default CommentInput;

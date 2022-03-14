import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import CreatePostLink from "./CreatePostLink";

type ContentWrapperProps = {};

const ContentWrapper: React.FC<ContentWrapperProps> = () => {
  return (
    <Flex justify="center" border="1px solid pink" p="16px">
      <Flex width="95%" maxWidth="860px" border="1px solid red">
        {/* <Box width="65%" border="1px solid green"></Box> */}
        {/* Left Content */}
        <CreatePostLink />
        <Box flexGrow={1} border="1px solid blue">
          hello
        </Box>

        {/* Right Content */}
      </Flex>
    </Flex>
  );
};
export default ContentWrapper;

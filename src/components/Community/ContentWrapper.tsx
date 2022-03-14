import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import CreatePostLink from "./CreatePostLink";
import About from "./About";

type ContentWrapperProps = {};

const ContentWrapper: React.FC<ContentWrapperProps> = () => {
  return (
    <Flex justify="center" p="16px 0px">
      <Flex width="95%" maxWidth="860px">
        {/* <Box width="65%" border="1px solid green"></Box> */}
        {/* Left Content */}
        <Flex width={{ base: "100%", md: "65%" }} mr={{ base: 0, md: 6 }}>
          <CreatePostLink />
        </Flex>
        <About />
        {/* <Box
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
          border="1px solid blue"
        >
          hello
        </Box> */}

        {/* Right Content */}
      </Flex>
    </Flex>
  );
};
export default ContentWrapper;

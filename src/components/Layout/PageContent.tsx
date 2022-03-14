import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import About from "../Community/About";
import CreatePostLink from "../Community/CreatePostLink";

const PageContentLayout: React.FC = ({ children }) => {
  console.log("HERE ARE CHILDREN", children);

  return (
    <Flex justify="center" p="16px 0px">
      <Flex width="95%" maxWidth="860px">
        {/* <Box width="65%" border="1px solid green"></Box> */}
        {/* Left Content */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        {/* Right Content */}
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Box>
      </Flex>
    </Flex>
  );
};

export default PageContentLayout;

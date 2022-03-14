import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import CreatePostLink from "./CreatePostLink";
import About from "./About";
import PageContentLayout from "../Layout/PageContent";

type ContentWrapperProps = {};

const ContentWrapper: React.FC<ContentWrapperProps> = () => {
  return (
    <PageContentLayout>
      {/* Left Content */}
      <>
        <CreatePostLink />
      </>
      {/* Right Content */}
      <>
        <About />
      </>
    </PageContentLayout>
  );
};
export default ContentWrapper;

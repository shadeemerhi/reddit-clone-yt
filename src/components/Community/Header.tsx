import React from "react";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";

type HeaderProps = {
  communityData: any;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justifyContent="center" bg="white" height="50%">
        <Flex width="60%">
          <Icon
            as={FaReddit}
            fontSize={64}
            position="relative"
            top={-3}
            color="blue.500"
            border="4px solid white"
            borderRadius="50%"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;

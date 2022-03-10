import { Box, Flex, Icon } from "@chakra-ui/react";
import React from "react";

import { BsArrowUpRightCircle } from "react-icons/bs";
import { IoFilterCircleOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import ActionIcon from "./ActionIcon";

type ActionIconsProps = {};

const ActionIcons: React.FC<ActionIconsProps> = () => {
  return (
    <Flex alignItems="center" flexGrow={1}>
      <Flex
        mr={1.5}
        ml={1.5}
        padding={1}
        cursor="pointer"
        _hover={{ bg: "gray.200" }}
      >
        <Icon as={BsArrowUpRightCircle} fontSize={20} />
      </Flex>
      <Flex
        mr={1.5}
        ml={1.5}
        padding={1}
        cursor="pointer"
        _hover={{ bg: "gray.200" }}
      >
        <Icon as={IoFilterCircleOutline} fontSize={22} />
      </Flex>
      <Flex
        mr={1.5}
        ml={1.5}
        padding={1}
        cursor="pointer"
        _hover={{ bg: "gray.200" }}
      >
        <Icon as={IoVideocamOutline} fontSize={22} />
      </Flex>
      {/* <ActionIcon icon={BsArrowUpRightCircle} size={20} />
      <ActionIcon icon={IoFilterCircleOutline} size={20} />
      <ActionIcon icon={IoVideocamOutline} size={20} /> */}
    </Flex>
  );
};
export default ActionIcons;

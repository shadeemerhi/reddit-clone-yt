import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import { TiHome } from "react-icons/ti";
import { logout } from "../../../firebase/authFunctions";

type DirectoryProps = {};

const Directory: React.FC<DirectoryProps> = () => {
  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius="4px"
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        mr={2}
        ml={2}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width={{ base: "auto", lg: "200px" }}
        >
          <Flex alignItems="center">
            <>
              <Icon fontSize={24} mr={{ base: 1, md: 2 }} as={TiHome} />
              <Box
                display={{ base: "none", lg: "flex" }}
                flexDirection="column"
                fontSize="10pt"
              >
                <Text fontWeight={600}>Home</Text>
              </Box>
            </>
          </Flex>
          <ChevronDownIcon color="gray.500" />
        </Flex>
      </MenuButton>
      <MenuList width="100%">
        <>
          {/* <Flex direction="column" mt={2} mb={4}> */}
          <Text pl={3} fontSize="7pt" fontWeight={500} color="gray.500">
            MY COMMUNITIES
          </Text>
          <MenuItem width="100%" fontSize="10pt" _hover={{ bg: "gray.100" }}>
            <Flex alignItems="center">
              <Icon fontSize={20} mr={2} as={GrAdd} />
              Create Community
            </Flex>
          </MenuItem>
          {/* </Flex> */}
          <Text pl={3} fontSize="7pt" fontWeight={500} color="gray.500">
            FEEDS
          </Text>
          <MenuItem width="100%" fontSize="10pt" _hover={{ bg: "gray.100" }}>
            <Flex alignItems="center">
              <Icon fontSize={20} mr={2} as={GrAdd} />
              Create Community
            </Flex>
          </MenuItem>
        </>
      </MenuList>
    </Menu>
  );
};
export default Directory;

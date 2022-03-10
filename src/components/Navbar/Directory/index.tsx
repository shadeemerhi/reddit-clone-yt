import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Flex,
  Icon,
  Box,
  MenuList,
  Text,
  MenuItem,
} from "@chakra-ui/react";
import { user } from "firebase-functions/v1/auth";
import { FaRedditSquare } from "react-icons/fa";
import { IoSparkles, IoHomeSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { VscAccount } from "react-icons/vsc";
import NoUserList from "../RightContent/ProfileMenu/NoUserList";
import UserList from "../RightContent/ProfileMenu/UserList";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
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
          <MenuItem
            width="100%"
            fontSize="10pt"
            fontWeight={700}
            _hover={{ bg: "blue.500", color: "white" }}
          >
            <Flex alignItems="center">
              <Icon fontSize={20} mr={2} as={CgProfile} />
              Profile
            </Flex>
          </MenuItem>
          <MenuItem
            fontSize="10pt"
            fontWeight={700}
            _hover={{ bg: "blue.500", color: "white" }}
            onClick={logout}
          >
            <Flex alignItems="center">
              <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
              Log Out
            </Flex>
          </MenuItem>
        </>
      </MenuList>
    </Menu>
  );
};
export default Directory;

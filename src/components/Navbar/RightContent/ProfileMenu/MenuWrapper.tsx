import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Flex,
  Icon,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsChevronDown } from "react-icons/bs";
import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { useRecoilState } from "recoil";
import { authModalState } from "../../../../atoms/authModalAtom";
import { auth } from "../../../../firebase/clientApp";

import NoUserList from "./NoUserList";
import UserList from "./UserList";

type MenuWrapperProps = {};

const MenuWrapper: React.FC<MenuWrapperProps> = () => {
  const [authModal, setModalState] = useRecoilState(authModalState);
  const [user] = useAuthState(auth);
  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="4px 6px"
        borderRadius="4px"
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex alignItems="center">
          <Icon
            fontSize={22}
            mr={1}
            color={user ? "gray.300" : "gray.400"}
            as={user ? FaRedditSquare : VscAccount}
          />
          <ChevronDownIcon color="gray.500" />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? <UserList /> : <NoUserList setModalState={setModalState} />}
      </MenuList>
    </Menu>
  );
};
export default MenuWrapper;

import { MenuItem, Flex, Icon, MenuDivider } from "@chakra-ui/react";
import React from "react";
import { MdOutlineLogin } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { logout } from "../../../../firebase/authFunctions";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase/clientApp";
import { useResetRecoilState } from "recoil";
import { myCommunitySnippetState } from "../../../../atoms/myCommunitySnippetsAtom";

type UserListProps = {};

const UserList: React.FC<UserListProps> = () => {
  const resetSnippets = useResetRecoilState(myCommunitySnippetState);

  const logout = async () => {
    await signOut(auth);
    resetSnippets();
  };

  return (
    <>
      <MenuItem
        fontSize="10pt"
        fontWeight={700}
        _hover={{ bg: "blue.500", color: "white" }}
      >
        <Flex alignItems="center">
          <Icon fontSize={20} mr={2} as={CgProfile} />
          Profile
        </Flex>
      </MenuItem>
      <MenuDivider />
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
  );
};
export default UserList;

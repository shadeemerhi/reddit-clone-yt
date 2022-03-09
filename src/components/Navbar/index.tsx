import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsChevronDown } from "react-icons/bs";
import { MdOutlineLogin } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import { userState } from "../../atoms/userAtom";
import { logout } from "../../firebase/authFunctions";
import { auth } from "../../firebase/clientApp";

const Navbar: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [user] = useAuthState(auth);
  // const currentUser = useRecoilValue(userState); // will implement later with custom user object

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 20px"
      justifyContent={{ md: "space-between" }}
    >
      <Box width={{ base: "40px", md: "auto" }} mr={2}>
        <Image src="/images/redditlogo.png" height="30px" />
      </Box>
      <Flex flexGrow={1} maxWidth="600px" mr={4} alignItems="center">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            children={<SearchIcon mb={2} />}
          />
          <Input
            placeholder="Search Reddit"
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            _focus={{
              outline: "none",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            height="30px"
            bg="gray.50"
          />
        </InputGroup>
      </Flex>
      {!user ? (
        <Flex
          width={{ sm: "auto", md: "300px" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="outline"
            display={{ base: "none", sm: "flex" }}
            width={{ base: "70px", md: "110px" }}
            mr={1}
            onClick={() => setAuthModalState({ open: true, view: "login" })}
          >
            Log In
          </Button>
          <Button
            variant="solid"
            display={{ base: "none", sm: "flex" }}
            width={{ base: "70px", md: "110px" }}
            mr={1}
            onClick={() => setAuthModalState({ open: true, view: "signup" })}
          >
            Sign Up
          </Button>
          <Menu>
            <MenuButton
              cursor="pointer"
              padding="4px 6px"
              borderRadius="4px"
              _hover={{ outline: "1px solid", outlineColor: "gray.100" }}
            >
              <Flex alignItems="center">
                <Icon fontSize={22} mr={1} color="gray.500" as={VscAccount} />
                <Icon color="gray.500" as={BsChevronDown} />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{ bg: "blue.500", color: "white" }}
                onClick={() => setAuthModalState({ open: true, view: "login" })}
              >
                <Flex alignItems="center">
                  <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                  Log In / Sign Up
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <>
          {user.displayName} <Button onClick={logout}>Logout</Button>
        </>
      )}
    </Flex>
  );
};
export default Navbar;

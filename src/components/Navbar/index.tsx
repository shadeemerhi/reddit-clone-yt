import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import { auth } from "../../firebase/clientApp";
import RightContentWrapper from "./RightContent";

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
      <RightContentWrapper />
    </Flex>
  );
};
export default Navbar;

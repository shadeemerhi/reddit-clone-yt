import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import { auth } from "../../firebase/clientApp";
import RightContentWrapper from "./RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
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
      <SearchInput user={user as User} />
      <RightContentWrapper user={user as User} />
    </Flex>
  );
};
export default Navbar;

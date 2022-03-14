import { Box, Flex, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import Directory from "./Directory";
import RightContent from "./RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  // const currentUser = useRecoilValue(userState); // will implement later with custom user object

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justifyContent={{ md: "space-between" }}
    >
      <Link href="/">
        <Box width={{ base: "40px", md: "auto" }} mr={2} cursor="pointer">
          <Image src="/images/redditlogo.png" height="30px" />
        </Box>
      </Link>
      {user && <Directory />}
      <SearchInput user={user as User} />
      <RightContent user={user as User} />
    </Flex>
  );
};
export default Navbar;

import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import {
  defaultMenuItem,
  directoryMenuState,
} from "../../atoms/directoryMenuAtom";
import { auth } from "../../firebase/clientApp";
import Directory from "./Directory";
import RightContent from "./RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);

  // Use <Link> for initial build; implement directory logic near end
  const setDirectoryState = useSetRecoilState(directoryMenuState);

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justifyContent={{ md: "space-between" }}
    >
      <Box
        width={{ base: "40px", md: "auto" }}
        mr={2}
        cursor="pointer"
        onClick={() => setDirectoryState(defaultMenuItem)}
      >
        <Image src="/images/redditlogo.png" height="30px" />
      </Box>
      {user && <Directory />}
      <SearchInput user={user as User} />
      <RightContent user={user as User} />
    </Flex>
  );
};
export default Navbar;

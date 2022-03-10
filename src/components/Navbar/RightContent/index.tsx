import { Flex } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import MenuWrapper from "./ProfileMenu/MenuWrapper";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import { User } from "firebase/auth";

type RightContentWrapper = {
  user: User;
};

const RightContentWrapper: React.FC<RightContentWrapper> = ({ user }) => {
  return (
    <Flex
      // width={{ sm: "auto", md: "300px" }}
      justifyContent="space-between"
      alignItems="center"
    >
      {user ? <Icons /> : <AuthButtons />}
      <MenuWrapper />
    </Flex>
  );
};
export default RightContentWrapper;

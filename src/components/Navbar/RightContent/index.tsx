import { Flex } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import MenuWrapper from "../Menu/MenuWrapper";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";

type RightContentWrapper = {};

const RightContentWrapper: React.FC<RightContentWrapper> = () => {
  const [user] = useAuthState(auth);
  return (
    <Flex
      width={{ sm: "auto", md: "300px" }}
      justifyContent="space-between"
      alignItems="center"
      //   border="1px solid red"
    >
      {user ? <Icons /> : <AuthButtons />}
      <MenuWrapper />
    </Flex>
  );
};
export default RightContentWrapper;

import { Flex, Button, Image, Box } from "@chakra-ui/react";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import { signInWithGoogle } from "../../../firebase/authFunctions";

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
  // const { signInWithGoogle } = useAuth();
  return (
    <Flex direction="column" mb={4}>
      <Button variant="oauth" mb={2} onClick={signInWithGoogle}>
        <Image src="/images/googlelogo.png" height="20px" mr={4} />
        Continue with Google
      </Button>
      <Button variant="oauth">Some Other Provider</Button>
    </Flex>
  );
};
export default OAuthButtons;

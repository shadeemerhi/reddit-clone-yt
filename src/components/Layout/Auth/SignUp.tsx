import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import InputItem from "../InputItem";

type SignUpProps = {
  toggleView: () => void;
};

const SignUp: React.FC<SignUpProps> = ({ toggleView }) => {
  return (
    <>
      <InputItem name="email" placeholder="email" type="text" mb={2} />
      <InputItem
        name="password"
        placeholder="password"
        type="password"
        mb={2}
      />
      <InputItem
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        mb={4}
      />
      <Button width="100%" mb={2} type="submit">
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Have an account?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={toggleView}
        >
          LOG IN
        </Text>
      </Flex>
    </>
  );
};
export default SignUp;

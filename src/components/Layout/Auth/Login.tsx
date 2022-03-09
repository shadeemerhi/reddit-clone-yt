import { Button, Flex, FormErrorMessage, Text } from "@chakra-ui/react";
import React from "react";
import InputItem from "../InputItem";

type LoginProps = {
  toggleView: () => void;
};

const Login: React.FC<LoginProps> = ({ toggleView }) => {
  return (
    <>
      <InputItem name="email" placeholder="email" type="text" mb={2} />
      <InputItem
        name="password"
        placeholder="password"
        type="password"
        mb={4}
      />
      <FormErrorMessage mb={4}>The password is invalid</FormErrorMessage>
      <Button width="100%" mb={2} type="submit">
        Log In
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={toggleView}
        >
          SIGN UP
        </Text>
      </Flex>
    </>
  );
};
export default Login;

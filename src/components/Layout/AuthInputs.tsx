import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import InputItem from "./InputItem";

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
  //   const { view } = useRecoilValue(authModalState);
  const [modalState, setModalState] = useRecoilState(authModalState);

  const toggleView = () => {
    setModalState({
      ...modalState,
      view: modalState.view === "login" ? "signup" : "login",
    });
  };

  return (
    <Flex direction="column" alignItems="center" width="100%" mt={4}>
      {modalState.view === "login" ? (
        <>
          <InputItem name="email" placeholder="email" type="text" mb={2} />
          <InputItem
            name="password"
            placeholder="password"
            type="password"
            mb={4}
          />
          <Button width="100%" mb={2}>
            Log In
          </Button>
          <Flex fontSize="9pt">
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
      ) : (
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
          <Button width="100%" mb={2}>
            Sign Up
          </Button>
          <Flex fontSize="9pt">
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
      )}
    </Flex>
  );
};
export default AuthInputs;

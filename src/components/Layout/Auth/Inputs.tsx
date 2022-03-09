import { Flex } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import useAuth from "../../../hooks/useAuth";
import Login from "./Login";
import SignUp from "./SignUp";

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  // const { signup } = useAuth();

  const toggleView = () => {
    setModalState({
      ...modalState,
      view: modalState.view === "login" ? "signup" : "login",
    });
  };

  const onSubmit = () => {
    event?.preventDefault();
    console.log("WE ARE SUBMITTING");
  };

  return (
    <Flex direction="column" alignItems="center" width="100%" mt={4}>
      <form onSubmit={onSubmit}>
        {modalState.view === "login" ? (
          <Login toggleView={toggleView} />
        ) : (
          <SignUp toggleView={toggleView} />
        )}
      </form>
    </Flex>
  );
};
export default AuthInputs;

import React, { useCallback } from "react";
import { FormControl } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import Login from "./Login";
import SignUp from "./SignUp";

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);

  const toggleView = () => {
    setModalState({
      ...modalState,
      view: modalState.view === "login" ? "signup" : "login",
    });
  };

  return (
    <FormControl
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      mt={4}
      isInvalid={true}
    >
      {modalState.view === "login" ? (
        <Login toggleView={toggleView} />
      ) : (
        <SignUp toggleView={toggleView} />
      )}
    </FormControl>
  );
};
export default AuthInputs;

import React, { useEffect } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import OAuthButtons from "./OAuthButtons";
import AuthInputs from "./Inputs";
import { userState } from "../../../atoms/userAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));

  const currentUser = useRecoilValue(userState);
  const [user, error] = useAuthState(auth);

  // useEffect(() => {
  //   if (currentUser) handleClose();
  // }, [currentUser]);

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {modalState.view === "login" ? "Login" : "Sign Up"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              width="60%"
              minHeight="300px"
            >
              <></>
              <OAuthButtons />
              OR
              <AuthInputs />
              {/* // Will implement at end of tutorial */}
              {/* {user && !currentUser && (
                <>
                  <Spinner size="lg" mt={2} mb={2} />
                  <Text fontSize="8pt" textAlign="center" color="blue.500">
                    You are logged in. You will be redirected soon
                  </Text>
                </>
              )} */}
              {/* {false ? (
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                </Flex>
              ) : (
              )} */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;

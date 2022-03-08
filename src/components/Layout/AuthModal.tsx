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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalState.view === "login" ? "Login" : "Sign Up"}
          </ModalHeader>
          <ModalCloseButton />
          {modalState.view === "login" ? (
            <ModalBody>Log In Body</ModalBody>
          ) : (
            <ModalBody>Sign Up Body</ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;

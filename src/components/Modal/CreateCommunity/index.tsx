import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";

type CreateCommunityModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  handleClose,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose}>
      <ModalHeader display="flex" flexDirection="column">
        Create a community
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
          width="70%"
        ></Flex>
      </ModalBody>
    </ModalWrapper>
  );
};
export default CreateCommunityModal;

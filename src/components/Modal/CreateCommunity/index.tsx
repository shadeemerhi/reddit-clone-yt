import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Text,
  Divider,
  Box,
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
      <ModalHeader
        display="flex"
        flexDirection="column"
        fontSize={15}
        padding={3}
      >
        Create a community
      </ModalHeader>
      <Box pr={3} pl={3}>
        <Divider />
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" padding="10px 0px">
          <Text fontWeight={600} fontSize={15}>
            Name
          </Text>
          <Text fontSize={11} color="gray.500">
            Community names including capitalization cannot be changed
          </Text>
        </ModalBody>
      </Box>
    </ModalWrapper>
  );
};
export default CreateCommunityModal;

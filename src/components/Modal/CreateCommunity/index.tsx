import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Text,
  Divider,
  Box,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import InputItem from "../../Layout/InputItem";
import ModalWrapper from "../ModalWrapper";

type CreateCommunityModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const [name, setName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [nameError, setNameError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const handleCreateCommunity = () => {
    if (nameError) setNameError("");
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(name) || nameError.length < 3) {
      setNameError(
        "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
      );
    }
  };

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
          <Text
            color="gray.400"
            position="relative"
            top="28px"
            left="10px"
            width="20px"
          >
            r/
          </Text>
          <Input
            position="relative"
            name="name"
            value={name}
            onChange={handleChange}
            pl="22px"
            type={""}
            size="sm"
          />
          <Text
            fontSize="9pt"
            color={charsRemaining === 0 ? "red" : "gray.500"}
            pt={2}
          >
            {charsRemaining} Characters remaining
          </Text>
          <Text fontSize="9pt" color="red" pt={1}>
            {nameError}
          </Text>
        </ModalBody>
      </Box>
      <ModalFooter bg="gray.100">
        <Button variant="outline" height="30px" mr={2} onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="solid" height="30px" onClick={handleCreateCommunity}>
          Create Community
        </Button>
      </ModalFooter>
    </ModalWrapper>
  );
};
export default CreateCommunityModal;

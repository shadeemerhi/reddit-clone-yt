import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import React from "react";

type InputItemProps = {
  name: string;
  placeholder: string;
  type: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mb?: number;
};

const InputItem: React.FC<InputItemProps> = ({
  name,
  placeholder,
  type,
  onChange,
  mb,
}) => {
  return (
    <Input
      required
      onChange={onChange}
      mb={mb}
      fontSize="10pt"
      _placeholder={{ color: "gray.500" }}
      _hover={{
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
      _focus={{
        outline: "none",
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
      bg="gray.50"
      name={name}
      placeholder={placeholder}
      type={type}
    />
  );
};
export default InputItem;

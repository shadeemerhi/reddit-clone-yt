import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <Flex
      bg="white"
      height="42px"
      padding="6px 10px"
      //   justifyContent="space-between"
    >
      <Box width="10%" minWidth="100px">
        <Image src="/images/redditlogo.png" height="30px" />
      </Box>
      <Flex flexGrow={1}>
        <Box width="70%" mr={4}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              children={<SearchIcon mb={2} />}
            />
            <Input
              placeholder="Search Reddit"
              fontSize={"10pt"}
              _placeholder={{ color: "gray.500" }}
              _hover={{
                bg: "white",
                border: "1px solid",
                borderColor: "blue.400",
              }}
              _focus={{
                outline: "none",
              }}
              height="30px"
              bg="gray.50"
            />
          </InputGroup>
        </Box>
        <Flex flexGrow={1} justifyContent="space-between">
          <Button
            width="120px"
            height="28px"
            borderRadius="60px"
            color="blue.600"
            bg="white"
            border={"1px solid"}
            borderColor="blue.600"
          >
            Log In
          </Button>
          <Button
            width="120px"
            height="28px"
            borderRadius="60px"
            color="white"
            bg="blue.600"
          >
            Sign Up
          </Button>
          <SearchIcon />
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Navbar;

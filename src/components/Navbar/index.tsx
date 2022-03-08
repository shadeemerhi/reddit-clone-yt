import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  AddIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  RepeatIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { VscAccount } from "react-icons/vsc";
import { BsChevronDown } from "react-icons/bs";
import { MdOutlineLogin } from "react-icons/md";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 20px"
      justifyContent={{ md: "space-between" }}
    >
      <Box width={{ base: "40px", md: "auto" }} mr={2}>
        <Image src="/images/redditlogo.png" height="30px" />
      </Box>
      <Flex flexGrow={1} maxWidth="600px" mr={4} alignItems="center">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.400"
            children={<SearchIcon mb={2} />}
          />
          <Input
            placeholder="Search Reddit"
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            _focus={{
              outline: "none",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            height="30px"
            bg="gray.50"
          />
        </InputGroup>
      </Flex>
      <Flex
        width={{ sm: "auto", md: "300px" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="outline"
          display={{ base: "none", sm: "flex" }}
          width={{ base: "70px", md: "110px" }}
          mr={1}
        >
          Log In
        </Button>
        <Button
          variant="solid"
          display={{ base: "none", sm: "flex" }}
          width={{ base: "70px", md: "110px" }}
          mr={1}
        >
          Sign Up
        </Button>
        <Menu>
          <MenuButton
            cursor="pointer"
            padding="4px 6px"
            borderRadius="4px"
            _hover={{ outline: "1px solid", outlineColor: "gray.100" }}
          >
            <Flex alignItems="center">
              <Icon fontSize={22} mr={1} color="gray.500" as={VscAccount} />
              <Icon color="gray.500" as={BsChevronDown} />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: "blue.500", color: "white" }}
            >
              <Flex alignItems="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};
export default Navbar;

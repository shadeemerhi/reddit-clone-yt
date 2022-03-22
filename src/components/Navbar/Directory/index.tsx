import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { TiHome } from "react-icons/ti";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  DirectoryMenuItem,
  directoryMenuState,
} from "../../../atoms/directoryMenuAtom";
import CreateCommunityModal from "../../Modal/CreateCommunity";
import Communities from "./Communities";

const Directory: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // Use <Link> for initial build; implement directory logic near end
  const directoryState = useRecoilValue(directoryMenuState);

  useEffect(() => {
    router.push(directoryState.link);
  }, [directoryState]);

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            cursor="pointer"
            padding="0px 6px"
            borderRadius="4px"
            _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
            mr={2}
            ml={2}
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              width={{ base: "auto", lg: "200px" }}
            >
              <Flex alignItems="center">
                <>
                  <Icon
                    fontSize={24}
                    mr={{ base: 1, md: 2 }}
                    color={directoryState.iconColor}
                    as={directoryState.icon}
                  />
                  <Box
                    display={{ base: "none", lg: "flex" }}
                    flexDirection="column"
                    fontSize="10pt"
                  >
                    <Text fontWeight={600}>{directoryState.displayText}</Text>
                  </Box>
                </>
              </Flex>
              <ChevronDownIcon color="gray.500" />
            </Flex>
          </MenuButton>
          <MenuList maxHeight="300px" overflow="scroll" overflowX="hidden">
            <Communities menuOpen={isOpen} />
          </MenuList>
        </>
      )}
    </Menu>
  );
};
export default Directory;

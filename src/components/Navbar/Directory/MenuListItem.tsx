import React from "react";
import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";
import { IconType } from "react-icons";
import { useSetRecoilState } from "recoil";
import { directoryMenuState } from "../../../atoms/directoryMenuAtom";

type DirectoryItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
};

const MenuListItem: React.FC<DirectoryItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
}) => {
  const setDirectoryState = useSetRecoilState(directoryMenuState);
  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() => setDirectoryState({ displayText, link, icon, iconColor })}
    >
      <Flex alignItems="center">
        <Icon fontSize={20} mr={2} as={icon} color={iconColor} />
        {displayText}
      </Flex>
    </MenuItem>
  );
};
export default MenuListItem;

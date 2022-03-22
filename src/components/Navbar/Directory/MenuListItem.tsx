import React from "react";
import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import { IconType } from "react-icons";
import useDirectory from "../../../hooks/useDirectory";

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
  const { onSelectMenuItem } = useDirectory();
  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() => onSelectMenuItem({ displayText, link, icon, iconColor })}
    >
      <Flex alignItems="center">
        <Icon fontSize={20} mr={2} as={icon} color={iconColor} />
        {displayText}
      </Flex>
    </MenuItem>
  );
};
export default MenuListItem;

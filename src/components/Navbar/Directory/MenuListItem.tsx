import React from "react";
import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";

type MenuListItemProps = {
  displayText: string;
  link: string;
  icon: typeof Icon;
  iconColor: string;
};

const MenuListItem: React.FC<MenuListItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
}) => {
  return (
    <Link href={link}>
      <MenuItem width="100%" fontSize="10pt" _hover={{ bg: "gray.100" }}>
        <Flex alignItems="center">
          <Icon fontSize={20} mr={2} as={icon} color={iconColor} />
          {displayText}
        </Flex>
      </MenuItem>
    </Link>
  );
};
export default MenuListItem;

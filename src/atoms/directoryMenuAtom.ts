import { atom } from "recoil";
import { IconType } from "react-icons";
import { TiHome } from "react-icons/ti";

export type DirectoryMenuItem = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
};

interface DirectoryMenuState {
  isOpen: boolean;
  selectedMenuItem: DirectoryMenuItem;
}

export const defaultMenuItem: DirectoryMenuState = {
  isOpen: false,
  selectedMenuItem: {
    displayText: "Home",
    link: "/",
    icon: TiHome,
    iconColor: "black",
  },
};

export const directoryMenuState = atom({
  key: "directoryMenuState",
  default: defaultMenuItem,
});

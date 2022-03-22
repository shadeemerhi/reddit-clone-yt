import { atom } from "recoil";
import { IconType } from "react-icons";
import { TiHome } from "react-icons/ti";

export type DirectoryMenuItem = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
};

export const defaultMenuItem: DirectoryMenuItem = {
  displayText: "Home",
  link: "/",
  icon: TiHome,
  iconColor: "black",
};

export const directoryMenuState = atom({
  key: "directoryMenuState",
  default: defaultMenuItem,
});

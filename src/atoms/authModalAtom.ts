import { atom } from "recoil";

interface AuthModalState {
  open: boolean;
  view: "login" | "signup";
}

const defaultModalState: AuthModalState = {
  open: false,
  view: "login",
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalState,
});

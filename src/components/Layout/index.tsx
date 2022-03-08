import React from "react";
import Navbar from "../Navbar";
import AuthModal from "./AuthModal";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <AuthModal />
    </>
  );
};

export default Layout;

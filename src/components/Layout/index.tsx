import React from "react";
import Navbar from "../Navbar";
import AuthModal from "./Auth/AuthModal";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <AuthModal />
    </>
  );
};

export default Layout;

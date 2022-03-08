import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { firestore } from "../firebase/clientApp";
import Layout from "../components/Layout";
import Main from "../components/Main";

const Home: NextPage = () => {
  return (
    <Layout>
      <Main />
    </Layout>
  );
};

export default Home;

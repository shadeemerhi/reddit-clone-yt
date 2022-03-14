import { Button, Flex } from "@chakra-ui/react";
import Header from "../../../components/Community/Header";
import type { NextPage, NextPageContext } from "next";
import { useRecoilValue } from "recoil";
import { myCommunitySnippetState } from "../../../atoms/myCommunitySnippetsAtom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";
import Link from "next/link";
import CommunityNotFound from "../../../components/Community/CommunityNotFound";
import ContentWrapper from "../../../components/Community/ContentWrapper";
import dynamic from "next/dynamic";

interface CommunityPageProps {
  communityData: string;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  console.log("HERE IS COMMUNITY DATA", communityData);

  // set current community in recoil state to access in directory

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <ContentWrapper />
    </>
  );
};

export default dynamic(() => Promise.resolve(CommunityPage), {
  ssr: false,
});

export async function getServerSideProps(context: NextPageContext) {
  console.log("GET SERVER SIDE PROPS RUNNING");

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.community as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? { id: communityDoc.id, ...communityDoc.data() }
          : "",
      },
    };
  } catch (error) {
    // Could create error page here
    console.log("getServerSideProps error - [community]", error);
  }
}

// export default CommunityPage;

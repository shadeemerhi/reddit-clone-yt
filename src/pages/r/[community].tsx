import { Button, Flex } from "@chakra-ui/react";
import Header from "../../components/Community/Header";
import type { NextPage, NextPageContext } from "next";
import { useRecoilValue } from "recoil";
import { communitySnippetState } from "../../atoms/communitySnippetAtom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import Link from "next/link";
import CommunityNotFound from "../../components/Community/CommunityNotFound";

interface CommunityPageProps {
  communityData: string;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  const snippetState = useRecoilValue(communitySnippetState);
  console.log("here is snippet state", snippetState);

  return <Header communityData={communityData} />;
};

export async function getServerSideProps(context: NextPageContext) {
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.community as string
    );
    const communityDoc = await getDoc(communityDocRef);
    console.log("here is community doc", communityDoc.data());
    return {
      props: {
        communityData: communityDoc.data() || "",
      },
    };
  } catch (error) {
    // Could create error page here
    console.log("getServerSideProps error - [community]", error);
  }
}

export default CommunityPage;

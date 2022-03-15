import { useEffect } from "react";
import type { NextPage, NextPageContext } from "next";
import { doc, getDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Community,
  visitedCommunitiesState,
} from "../../../atoms/visitedCommunities";
import About from "../../../components/Community/About";
import CommunityNotFound from "../../../components/Community/CommunityNotFound";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Header from "../../../components/Community/Header";
import PageContentLayout from "../../../components/Layout/PageContent";
import { auth, firestore } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

interface CommunityPageProps {
  communityData: Community;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const [user, loading] = useAuthState(auth);
  const [visitedCommunities, setVisitedCommunities] = useRecoilState(
    visitedCommunitiesState
  );

  // set current community in recoil state to access in directory

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  useEffect(() => {
    // First time the user has navigated to this page - add to cache
    const firstSessionVisit = !visitedCommunities.find(
      (item) => item.id === communityData.id
    );
    if (firstSessionVisit) {
      setVisitedCommunities((prev) => [...prev, communityData]);
    }
  }, []);

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        {/* Left Content */}
        <>{user && <CreatePostLink />}</>
        {/* Right Content */}
        <>
          <About communityData={communityData} />
        </>
      </PageContentLayout>
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

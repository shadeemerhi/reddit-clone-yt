import { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { NextPage, NextPageContext } from "next";
import dynamic from "next/dynamic";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";
import {
  communitiesState,
  Community,
  Post,
} from "../../../atoms/communitiesAtom";
import About from "../../../components/Community/About";
import CommunityNotFound from "../../../components/Community/CommunityNotFound";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Header from "../../../components/Community/Header";
import PageContentLayout from "../../../components/Layout/PageContent";
import PostItem from "../../../components/Post/PostItem";
import { auth, firestore } from "../../../firebase/clientApp";

interface CommunityPageProps {
  communityData: Community;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const [currCommunitiesState, setCurrCommunitiesState] =
    useRecoilState(communitiesState);

  useEffect(() => {
    // First time the user has navigated to this community page - add to cache
    const firstSessionVisit =
      !currCommunitiesState.visitedCommunities[communityData.id!];

    if (firstSessionVisit) {
      setCurrCommunitiesState((prev) => ({
        ...prev,
        visitedCommunities: {
          ...prev.visitedCommunities,
          [communityData.id!]: communityData,
        },
      }));
    }
  }, [communityData]);

  useEffect(() => {
    /**
     * --> CACHE SOLUTION WITH RECOIL -->
     */
    // if (
    //   !visitedCommunities[communityData.id as keyof typeof visitedCommunities]
    //     ?.posts.length
    // ) {
    //   setLoading(true);
    //   getPosts();
    // }
    /**
     * <-- CACHE SOLUTION WITH RECOIL <--
     */

    setLoading(true);
    const postsQuery = query(
      collection(firestore, "posts"),
      where("communityId", "==", communityData.id),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(postsQuery, (querySnaption) => {
      const posts = querySnaption.docs.map((post) => ({
        id: post.id,
        ...post.data(),
      }));
      console.log("HERE ARE POSTS", posts);
      setPosts(posts as []);
      setLoading(false);
    });
    // Remove real-time listener on component dismount
    return () => unsubscribe();
  }, [communityData]);

  /**
   * PART OF CACHED SOLUTION
   */
  // const getPosts = async () => {
  //   const postsQuery = query(
  //     collection(firestore, "posts"),
  //     where("communityId", "==", communityData.id)
  //   );
  //   const querySnapshot = await getDocs(postsQuery);
  //   const posts = querySnapshot.docs.map((post) => ({
  //     id: post.id,
  //     ...post.data(),
  //   }));
  //   // setPosts(posts as []);
  //   setVisitedCommunities((prev) => ({
  //     ...prev,
  //     [communityData.id]: {
  //       ...[communityData.id],
  //       posts,
  //     },
  //   }));
  //   setLoading(false);
  // };

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        {/* Left Content */}
        <>
          {user && <CreatePostLink />}
          {loading ? (
            <div>WILL ADD LOADERS</div>
          ) : (
            <Stack>
              {posts.map((post: Post) => (
                <PostItem key={post.id} post={post} />
              ))}
              {/* PART OF CACHED SOLUTION */}
              {/* {visitedCommunities[
                communityData.id as keyof typeof visitedCommunities
              ] &&
                visitedCommunities[
                  communityData.id as keyof typeof visitedCommunities
                ]?.posts.map((item) => <div key={item.id}>{item.title}</div>)} */}
            </Stack>
          )}
        </>
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
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : "",
      },
    };
  } catch (error) {
    // Could create error page here
    console.log("getServerSideProps error - [community]", error);
  }
}

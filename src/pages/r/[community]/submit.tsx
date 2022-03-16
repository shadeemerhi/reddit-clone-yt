import { NextPage, NextPageContext } from "next";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { communitiesState } from "../../../atoms/communitiesAtom";
import About from "../../../components/Community/About";
import PageContentLayout from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Post/PostForm/NewPostForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import safeJsonStringify from "safe-json-stringify";

const CreateCommmunityPostPage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { community } = router.query;
  const visitedCommunities =
    useRecoilValue(communitiesState).visitedCommunities;
  console.log("HERE ARE VISITED COMMUNITIES", visitedCommunities);

  // Redirects user if not logged in - can probably create protected route component
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }
    if (!visitedCommunities[community as string]) {
      router.push(`/r/${community}`);
    }
  }, [user, loading]);

  /**
   * Redirect users to main community page
   * This servers as a workaround to not SSRing
   * this page or fetching the community here
   * This solution assumes the client is coming from
   * the main community page
   */
  if (!visitedCommunities[community as string]) return null;

  return (
    <PageContentLayout maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && <NewPostForm communityId={community as string} user={user} />}
      </>
      {visitedCommunities[community as string] && (
        <>
          <About
            communityData={visitedCommunities[community as string]}
            pt={6}
            onCreatePage
          />
        </>
      )}
    </PageContentLayout>
  );
};

export default CreateCommmunityPostPage;

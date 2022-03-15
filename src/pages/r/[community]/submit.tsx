import { NextPage } from "next";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { visitedCommunitiesState } from "../../../atoms/visitedCommunities";
import About from "../../../components/Community/About";
import PageContentLayout from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Post/NewPostForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { useEffect } from "react";

const CreateCommmunityPostPage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { community } = router.query;
  const visitedCommunities = useRecoilValue(visitedCommunitiesState);
  console.log("HERE ARE VISITED COMMUNITIES", visitedCommunities);

  // Redirects user if not logged in - can probably create protected route component
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading]);

  return (
    <PageContentLayout maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && (
          <NewPostForm communityId={community as string} userId={user.uid} />
        )}
      </>
      <>
        <About
          communityData={visitedCommunities[community as string]}
          pt={6}
          onCreatePage
        />
      </>
    </PageContentLayout>
  );
};

export default CreateCommmunityPostPage;

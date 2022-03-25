import { Box, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import About from "../../../components/Community/About";
import PageContentLayout from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Post/PostForm/NewPostForm";
import { auth } from "../../../firebase/clientApp";
import useCommunityData from "../../../hooks/useCommunityData";

const CreateCommmunityPostPage: NextPage = () => {
  const [user, loadingUser, error] = useAuthState(auth);
  const router = useRouter();
  const { community } = router.query;
  const visitedCommunities = useRecoilValue(communityState).visitedCommunities;
  const { loading } = useCommunityData();

  return (
    <PageContentLayout maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && (
          <NewPostForm
            communityId={visitedCommunities[community as string].id}
            communityImageURL={
              visitedCommunities[community as string]?.imageURL
            }
            user={user}
          />
        )}
      </>
      {visitedCommunities[community as string] && (
        <>
          <About
            communityData={visitedCommunities[community as string]}
            pt={6}
            onCreatePage
            loading={loading}
          />
        </>
      )}
    </PageContentLayout>
  );
};

export default CreateCommmunityPostPage;

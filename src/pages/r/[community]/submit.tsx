import { NextPage } from "next";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { visitedCommunitiesState } from "../../../atoms/visitedCommunities";
import About from "../../../components/Community/About";
import PageContentLayout from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Post/NewPostForm";

const CreateCommmunityPostPage: NextPage = () => {
  const router = useRouter();
  const { community } = router.query;
  const visitedCommunities = useRecoilValue(visitedCommunitiesState);
  console.log("HERE ARE VISITED COMMUNITIES", visitedCommunities);

  return (
    <PageContentLayout>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        <NewPostForm />
      </>
      <>
        <About
          communityData={visitedCommunities.find(
            (item) => item.id === community
          )}
          pt={6}
        />
      </>
    </PageContentLayout>
  );
};

export default CreateCommmunityPostPage;

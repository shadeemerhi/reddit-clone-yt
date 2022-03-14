import {} from "react";
import { NextPage } from "next";
import Header from "../../../components/Community/Header";
import PageContentLayout from "../../../components/Layout/PageContent";
import { useRecoilValue } from "recoil";
import { visitedCommunitiesState } from "../../../atoms/visitedCommunities";
import About from "../../../components/Community/About";
import { useRouter } from "next/router";

const CreateCommmunityPostPage: NextPage = () => {
  const router = useRouter();
  const { community } = router.query;
  const visitedCommunities = useRecoilValue(visitedCommunitiesState);
  console.log("HERE ARE VISITED COMMUNITIES", visitedCommunities);

  return (
    <PageContentLayout>
      <>
        <div>hello</div>
      </>
      <>
        <About
          communityData={visitedCommunities.find(
            (item) => item.id === community
          )}
        />
      </>
    </PageContentLayout>
  );
};

export default CreateCommmunityPostPage;

import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

interface CommunityPageProps {
  someData: string;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ someData }) => {
  console.log("AT THIS PAGE LOL", someData);
  const router = useRouter();
  const { community } = router.query;

  return (
    <Layout>
      <div>The community page: {community}</div>
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      someData: "shadee",
    }, // will be passed to the page component as props
  };
}

export default CommunityPage;

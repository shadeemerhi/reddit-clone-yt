import { doc, getDoc } from "firebase/firestore";
import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useRecoilValue } from "recoil";
import { communitySnippetState } from "../../atoms/communitySnippetAtom";
import { auth, firestore } from "../../firebase/clientApp";

interface CommunityPageProps {
  communityData: string;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const router = useRouter();
  const { community } = router.query;

  const snippetState = useRecoilValue(communitySnippetState);
  console.log("here is snippet state", snippetState);

  // const [data, loading, error] = useDocumentData(
  //   doc(firestore, "communities", community as string)
  // );
  console.log("AT THIS PAGE LOL");

  return <div>The community page: {JSON.stringify(community)}</div>;
};

// export async function getServerSideProps(context: NextPageContext) {
//   const communityDocRef = doc(
//     firestore,
//     "communities",
//     context.query.community as string
//   );
//   const communityDoc = await getDoc(communityDocRef);
//   // try {
//   //   const communityDocRef = doc(
//   //     firestore,
//   //     "communities",
//   //     context.query.community as string
//   //   );
//   //   const communityDoc = await getDoc(communityDocRef);
//   //   throw new Error("lol");
//   // } catch (error: any) {
//   //   console.log("there was an error", error.message);
//   // }
//   return {
//     props: {
//       communityData: communityDoc.data(),
//     }, // will be passed to the page component as props
//   };
// }

export default CommunityPage;

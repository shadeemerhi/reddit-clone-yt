import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { myCommunitySnippetState } from "../atoms/myCommunitySnippetsAtom";
import { firestore } from "../firebase/clientApp";

// CURRENTLY NOT USING
const useCommunitySnippets = (uid?: string, menuOpen?: boolean) => {
  const [snippetState, setSnippetState] = useRecoilState(
    myCommunitySnippetState
  );
  const [loading, setLoading] = useState(snippetState.length === 0);

  useEffect(() => {
    if (snippetState.length || !uid || menuOpen === false) return;

    setLoading(true);
    console.log("GETTING VALS");

    getMySnippets();
  }, [snippetState, uid, menuOpen]);

  const getMySnippets = async () => {
    const snippetQuery = query(
      collection(firestore, `users/${uid}/communitySnippets`)
    );

    const snippetDocs = await getDocs(snippetQuery);
    const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

    // setSnippetState((prev) => ({
    //   ...prev,
    //   myCommunities: snippets as CommunitySnippet[],
    // }));
    setSnippetState(snippets as []);
    setLoading(false);
  };

  return { snippetState, loading };
};

export default useCommunitySnippets;

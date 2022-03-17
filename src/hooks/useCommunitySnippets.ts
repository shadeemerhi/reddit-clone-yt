import React, { useEffect, useState } from "react";
import { RecoilState, useRecoilState } from "recoil";

import { communitiesState, CommunitySnippet } from "../atoms/communitiesAtom";
import { getMySnippets } from "../helpers/firestore";

const useCommunitySnippets = (
  userId: string | undefined,
  preventFetchConditions: boolean,
  fetchDeps: any,
  initLoadingState: boolean
) => {
  const [currCommunitiesState, setCurrCommunitiesState] =
    useRecoilState(communitiesState);
  const [loading, setLoading] = useState(initLoadingState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preventFetchConditions || !!currCommunitiesState.mySnippets.length)
      return;
    getSnippets();

    // Check state cache for data; fetch if doesn't exis
  }, [...fetchDeps]);

  const getSnippets = async () => {
    setLoading(true);
    try {
      const snippets = await getMySnippets(userId!);
      setCurrCommunitiesState((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
      setLoading(false);
    } catch (error: any) {
      console.log("Error getting user snippets", error);
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    snippets: currCommunitiesState.mySnippets,
    loading,
    setLoading,
    error,
  };
};

export default useCommunitySnippets;

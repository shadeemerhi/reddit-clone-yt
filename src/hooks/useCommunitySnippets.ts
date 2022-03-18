import React, { useEffect, useState } from "react";
import { RecoilState, useRecoilState } from "recoil";

import { communityState, CommunitySnippet } from "../atoms/communitiesAtom";
import { getMySnippets } from "../helpers/firestore";

const useCommunitySnippets = (
  userId: string | undefined,
  preventFetchConditions: boolean,
  fetchDeps: any,
  initLoadingState: boolean
) => {
  const [currCommunityState, setCurrCommunityState] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(initLoadingState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (preventFetchConditions || !!currCommunityState.mySnippets.length)
      return;
    getSnippets();

    // Check state cache for data; fetch if doesn't exis
  }, [...fetchDeps]);

  const getSnippets = async () => {
    setLoading(true);
    try {
      const snippets = await getMySnippets(userId!);
      setCurrCommunityState((prev) => ({
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
    snippets: currCommunityState.mySnippets,
    loading,
    setLoading,
    error,
  };
};

export default useCommunitySnippets;

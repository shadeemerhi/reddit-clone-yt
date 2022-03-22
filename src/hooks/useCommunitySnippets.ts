import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { RecoilState, useRecoilState } from "recoil";

import { communityState, CommunitySnippet } from "../atoms/communitiesAtom";
import { auth } from "../firebase/clientApp";
import { getMySnippets } from "../helpers/firestore";

const useCommunitySnippets = () => {
  const [user] = useAuthState(auth);

  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   if (preventFetchConditions || !!communityStateValue.mySnippets.length)
  //     return;
  //   getSnippets();

  //   // Check state cache for data; fetch if doesn't exis
  // }, [...fetchDeps]);

  useEffect(() => {
    if (!user || !!communityStateValue.mySnippets.length) return;

    getSnippets();
  }, [user]);

  const getSnippets = async () => {
    setLoading(true);
    try {
      const snippets = await getMySnippets(user?.uid!);
      setCommunityStateValue((prev) => ({
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
    snippets: communityStateValue.mySnippets,
    loading,
    setLoading,
    error,
  };
};

export default useCommunitySnippets;

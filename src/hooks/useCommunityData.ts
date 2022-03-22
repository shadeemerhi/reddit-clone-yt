import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { RecoilState, useRecoilState } from "recoil";

import {
  communityState,
  CommunitySnippet,
  Community,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";
import { getMySnippets } from "../helpers/firestore";

// Add ssrCommunityData near end as small optimization
const useCommunityData = (ssrCommunityData?: boolean) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        initSnippetsFetched: true,
      }));
      setLoading(false);
    } catch (error: any) {
      console.log("Error getting user snippets", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    // this causes weird memory leak error - not sure why
    // setLoading(true);
    console.log("GETTING COMMUNITY DATA");

    try {
      const communityDocRef = doc(
        firestore,
        "communities",
        communityId as string
      );
      const communityDoc = await getDoc(communityDocRef);
      setCommunityStateValue((prev) => ({
        ...prev,
        visitedCommunities: {
          ...prev.visitedCommunities,
          [communityId as string]: {
            id: communityDoc.id,
            ...communityDoc.data(),
          } as Community,
        },
      }));
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (ssrCommunityData) return;
    const { community } = router.query;
    if (community) {
      const communityData =
        communityStateValue.visitedCommunities[community as string];
      if (!communityData) {
        getCommunityData(community as string);
        return;
      }
    }
  }, [router.query]);

  return {
    communityStateValue,
    // snippets: communityStateValue.mySnippets,
    // initSnippetsFetched: communityStateValue.initSnippetsFetched,
    loading,
    setLoading,
    error,
  };
};

export default useCommunityData;

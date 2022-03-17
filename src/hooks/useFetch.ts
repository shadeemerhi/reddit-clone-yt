import React, { useEffect, useState } from "react";
import { RecoilState, useRecoilState } from "recoil";

import { communitiesState } from "../atoms/communitiesAtom";

const useFetch = (
  recoilState: typeof communitiesState,
  stateKey: string,
  fetchFn: any,
  fetchFnArgs: any
) => {
  const [data, setData] = useRecoilState(recoilState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check state cache for data; fetch if doesn't exist
    if (!recoilState[stateKey as keyof typeof recoilState]) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchFn(fetchFnArgs);
      setData(data);
    } catch (error: any) {
      console.log("Error fetching data");
      setError(error.message);
    }
  };

  return { data, loading, error };
};

export default useFetch;

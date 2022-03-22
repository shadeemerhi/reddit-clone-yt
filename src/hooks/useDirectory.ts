import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import {
  DirectoryMenuItem,
  directoryMenuState,
} from "../atoms/directoryMenuAtom";
import { FaReddit } from "react-icons/fa";

const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();

  const communityStateValue = useRecoilValue(communityState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    // setState here
    setDirectoryState(menuItem);
    router.push(menuItem.link);
  };

  useEffect(() => {
    const { community } = router.query;

    const existingCommunity =
      communityStateValue.visitedCommunities[community as string];

    if (existingCommunity) {
      setDirectoryState({
        displayText: `r/${existingCommunity.id}`,
        link: `r/${existingCommunity.id}`,
        icon: FaReddit,
        iconColor: "blue.500",
      });
    }
  }, [router.query?.community, communityStateValue.visitedCommunities]);

  return { directoryState, onSelectMenuItem };
};

export default useDirectory;

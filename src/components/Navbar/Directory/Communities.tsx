import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Icon,
  MenuItem,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilState } from "recoil";
import {
  CommunitySnippet,
  myCommunitySnippetState,
} from "../../../atoms/myCommunitySnippetsAtom";
import { auth, firestore } from "../../../firebase/clientApp";
import CreateCommunityModal from "../../Modal/CreateCommunity";
import MenuListItem from "./MenuListItem";
import { getMySnippets } from "../../../helpers/firestore";

type CommunitiesProps = {
  menuOpen: boolean;
};

const Communities: React.FC<CommunitiesProps> = ({ menuOpen }) => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mySnippetsState, setMySnippetsState] = useRecoilState(
    myCommunitySnippetState
  );

  useEffect(() => {
    // Only fetch snippets if menu is open and we don't have them in state cache
    if (!user?.uid || !menuOpen || !!mySnippetsState.length) return;
    setLoading(true);
    getSnippets();
  }, [menuOpen, user]);

  const getSnippets = async () => {
    try {
      const snippets = await getMySnippets(user?.uid!);
      setMySnippetsState(snippets as CommunitySnippet[]);
      setLoading(false);
    } catch (error) {
      console.log("Error getting user snippets", error);
    }
  };

  if (loading) {
    return (
      <Stack p={3}>
        {Array.from(Array(10)).map((item, index) => (
          <Skeleton key={index} height="20px" p="inherit" />
        ))}
      </Stack>
    );
  }

  return (
    <>
      <CreateCommunityModal
        isOpen={open}
        handleClose={() => setOpen(false)}
        userId={user?.uid!}
      />
      {/* COULD DO THIS FOR CLEANER COMPONENTS */}
      {/* <Moderating snippets={snippetState.filter((item) => item.isModerator)} />
      <MyCommunities snippets={snippetState} setOpen={setOpen} /> */}
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippetsState
          .filter((item) => item.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              icon={FaReddit as typeof Icon}
              iconColor="brand.100"
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippetsState.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit as typeof Icon}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor="blue.500"
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;

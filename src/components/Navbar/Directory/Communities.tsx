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
import { auth, firestore } from "../../../firebase/clientApp";
import CreateCommunityModal from "../../Modal/CreateCommunity";
import MenuListItem from "./MenuListItem";
import { useRecoilState } from "recoil";
import {
  CommunitySnippet,
  communitySnippetState,
} from "../../../atoms/communitySnippetAtom";

type CommunitiesProps = {
  menuOpen: boolean;
};

const Communities: React.FC<CommunitiesProps> = ({ menuOpen }) => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snippetState, setSnippetState] = useRecoilState(communitySnippetState);
  // const [snippetState, setSnippetState] = useState<CommunitySnippet[]>([]);

  useEffect(() => {
    // Only fetch snippets if menu is open and we don't have them in state cache
    if (!menuOpen || !!snippetState.myCommunities.length) return;
    setLoading(true);
    getMySnippets();
  }, [menuOpen]);

  const getMySnippets = async () => {
    const snippetQuery = query(
      collection(firestore, `users/${user?.uid}/communitySnippets`)
    );

    const snippetDocs = await getDocs(snippetQuery);
    const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

    setSnippetState((prev) => ({
      ...prev,
      myCommunities: snippets as CommunitySnippet[],
    }));
    setLoading(false);
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
        {snippetState.myCommunities
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
        {snippetState.myCommunities.map((snippet) => (
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

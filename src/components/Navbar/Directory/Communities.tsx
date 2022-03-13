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

type CommunitiesProps = {
  menuOpen: boolean;
};

export interface CommunitySnippet {
  communityId: string;
  name: string;
  isModerator?: boolean;
}

const Communities: React.FC<CommunitiesProps> = ({ menuOpen }) => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snippetState, setSnippetState] = useState<CommunitySnippet[]>([]);

  useEffect(() => {
    // Only fetch snippets if menu is open and we don't have them in state cache
    if (!menuOpen || !!snippetState.length) return;
    setLoading(true);
    getSnippets();
  }, [menuOpen]);

  const getSnippets = async () => {
    const snippetQuery = query(
      collection(firestore, `users/${user?.uid}/communitySnippets`)
    );

    const snippetDocs = await getDocs(snippetQuery);
    const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

    setSnippetState(snippets as CommunitySnippet[]);
    setLoading(false);
  };

  if (loading) {
    return (
      <Stack p={3}>
        {Array.from(Array(10)).map((item) => (
          <Skeleton height="20px" p="inherit" />
        ))}
      </Stack>
    );
  }

  return (
    <>
      <CreateCommunityModal
        isOpen={open}
        handleClose={() => setOpen(false)}
        setSnippetState={setSnippetState}
        userId={user?.uid!}
      />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {snippetState
          .filter((item) => item.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              displayText={`r/${snippet.name}`}
              link={`r/${snippet.name}`}
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
        {snippetState.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit as typeof Icon}
            displayText={`r/${snippet.name}`}
            link={`r/${snippet.name}`}
            iconColor="blue.500"
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;

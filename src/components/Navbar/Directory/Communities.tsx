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
import { GrAdd } from "react-icons/gr";
import { RiRedditFill } from "react-icons/ri";
import { FaReddit } from "react-icons/fa";
import { collection, getDocs, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import CreateCommunityModal from "../../Modal/CreateCommunity";

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
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  return (
    <Box>
      <CreateCommunityModal
        isOpen={open}
        handleClose={() => setOpen(false)}
        setSnippetState={setSnippetState}
        userId={user?.uid!}
      />
      <Box>
        <Text pl={3} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {snippetState
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuItem
              width="100%"
              fontSize="10pt"
              _hover={{ bg: "gray.100" }}
              onClick={() => setOpen(true)}
            >
              <Flex alignItems="center">
                <Icon fontSize={20} mr={2} as={FaReddit} color="blue.500" />
                {`r/${snippet.name}`}
              </Flex>
            </MenuItem>
          ))}
      </Box>
      <Text pl={3} fontSize="7pt" fontWeight={500} color="gray.500">
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
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={FaReddit} color="blue.500" />
            {`r/${snippet.name}`}
          </Flex>
        </MenuItem>
      ))}
    </Box>
  );
};

export default Communities;

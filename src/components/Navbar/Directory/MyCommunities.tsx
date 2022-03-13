import React from "react";
import { MenuItem, Flex, Icon, Text, Box } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { CommunitySnippet } from "./Communities";

type MyCommunitiesProps = {
  snippets: CommunitySnippet[];
  setOpen: (value: boolean) => void;
};

const MyCommunities: React.FC<MyCommunitiesProps> = ({ snippets, setOpen }) => {
  return (
    <Box mt={3} mb={3}>
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
      {snippets.map((snippet) => (
        <MenuItem width="100%" fontSize="10pt" _hover={{ bg: "gray.100" }}>
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={FaReddit} color="blue.500" />
            {`r/${snippet.name}`}
          </Flex>
        </MenuItem>
      ))}
    </Box>
  );
};
export default MyCommunities;

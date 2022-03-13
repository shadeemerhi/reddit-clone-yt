import React from "react";
import { Box, MenuItem, Flex, Icon, Text, ListItem } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { CommunitySnippet } from "./Communities";

type ModeratingProps = {
  snippets: CommunitySnippet[];
};

const Moderating: React.FC<ModeratingProps> = ({ snippets }) => {
  return (
    <Box mt={3} mb={3}>
      <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
        MODERATING
      </Text>
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
export default Moderating;

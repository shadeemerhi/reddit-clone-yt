import { Box, Button, Flex, Icon, Skeleton, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import {
  CommunitySnippet,
  myCommunitySnippetState,
} from "../../atoms/myCommunitySnippetsAtom";
import { Community } from "../../atoms/visitedCommunities";
import { auth } from "../../firebase/clientApp";
import { getMySnippets } from "../../helpers/firestore";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [mySnippetsState, setMySnippetsState] = useRecoilState(
    myCommunitySnippetState
  );
  const [loading, setLoading] = useState(!mySnippetsState.length && !!user);

  const isJoined = mySnippetsState.find(
    (item) => item.communityId === communityData.id
  );

  const onJoin = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    if (isJoined) {
      console.log("LEAVING COMMUNITY");
      return;
    }
    console.log("JOINING COMMUNITY");
  };

  useEffect(() => {
    if (!!mySnippetsState.length || !user?.uid) return;
    setLoading(true);
    getSnippets();
  }, [user]);

  const getSnippets = async () => {
    try {
      const snippets = await getMySnippets(user?.uid!);
      setMySnippetsState(snippets as CommunitySnippet[]);
      setLoading(false);
    } catch (error) {
      console.log("Error getting user snippets", error);
    }
  };

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justifyContent="center" bg="white" height="50%">
        <Flex width="95%" maxWidth="860px">
          <Icon
            as={FaReddit}
            fontSize={64}
            position="relative"
            top={-3}
            color="blue.500"
            border="4px solid white"
            borderRadius="50%"
          />
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Flex>
              {loading ? (
                <Skeleton height="30px" width="80px" />
              ) : (
                <Button
                  variant="outline"
                  height="30px"
                  pr={6}
                  pl={6}
                  onClick={onJoin}
                >
                  {isJoined ? "Joined" : "Join"}
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;

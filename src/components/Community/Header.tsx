import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { deleteDoc, doc, writeBatch } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import {
  CommunitySnippet,
  myCommunitySnippetState,
} from "../../atoms/myCommunitySnippetsAtom";
import { Community } from "../../atoms/communitiesAtom";
import { auth, firestore } from "../../firebase/clientApp";
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

    setLoading(true);
    if (isJoined) {
      leaveCommunity();
      return;
    }
    joinCommunity();
  };

  const joinCommunity = async () => {
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id!,
        isModerator: communityData.creatorId === user?.uid,
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id! // will for sure have this value at this point
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id!), {
        numberOfMembers: communityData.numberOfMembers + 1,
      });

      // perform batch writes
      await batch.commit();

      // Add current community to snippet
      setMySnippetsState((prev) => [...prev, newSnippet]);
      setLoading(false);
    } catch (error) {
      console.log("joinCommunity error", error);
    }
  };

  const leaveCommunity = async () => {
    try {
      await deleteDoc(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets/${communityData.id}`
        )
      );
      // Remove current community from snippet state
      setMySnippetsState((prev) =>
        prev.filter((item) => item.communityId !== communityData.id)
      );
      setLoading(false);
    } catch (error) {
      console.log("leaveCommunity error", error);
    }
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
              <Button
                variant={isJoined ? "outline" : "solid"}
                height="30px"
                pr={6}
                pl={6}
                onClick={onJoin}
                isLoading={loading}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;

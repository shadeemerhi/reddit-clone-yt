import React from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "../../firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";

type HeaderProps = {
  communityData: any;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [value, loading, error] = useDocumentDataOnce(
    doc(
      firestore,
      "users",
      `${user?.uid}/communitySnippets/${communityData.id}`
    )
  );
  console.log("HERE IS STUFF", value, loading, error);
  const isJoined = !loading && value;

  const onJoin = () => {
    console.log("INSIDE FUNCTION");

    if (!user) {
      setAuthModalState({ open: true, view: "login" });
    }
  };

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justifyContent="center" bg="white" height="50%">
        <Flex width="60%">
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

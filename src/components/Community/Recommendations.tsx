import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";

type RecommendationsProps = {};

const Recommendations: React.FC<RecommendationsProps> = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Flex direction="column" bg="white" borderRadius={4}>
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        url('images/recCommsArt.png')"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {["comm1", "comm2", "comm3", "comm4", "comm5"].map(
              (item, index) => (
                <Flex
                  align="center"
                  justify="space-between"
                  fontSize="10pt"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  p="10px 20px"
                  fontWeight={600}
                >
                  <Text>{index + 1}</Text>
                  <Flex align="center">
                    <Icon
                      as={FaReddit}
                      fontSize={30}
                      color="brand.100"
                      mr={2}
                    />
                    <Text>{`r/${item}`}</Text>
                  </Flex>
                  <Button height="22px" fontSize="9pt">
                    Join
                  </Button>
                </Flex>
              )
            )}
            <Box p="10px 20px">
              <Button height="30px" width="100%">
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendations;

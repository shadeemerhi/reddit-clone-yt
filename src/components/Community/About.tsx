import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";

type AboutProps = {};

const About: React.FC<AboutProps> = () => {
  const router = useRouter();

  // Might add later
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(false);

  return (
    <Box
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      flexGrow={1}
      border="1px solid blue"
    >
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg="blue.400"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg="white">
        <Box
          bg="gray.100"
          width="100%"
          p={2}
          borderRadius={4}
          border="1px solid"
          borderColor="gray.300"
          cursor="pointer"
        >
          <Text fontSize="9pt" fontWeight={700} color="blue.500">
            Add description
          </Text>
        </Box>
        <Stack spacing={2}>
          <Flex width="100%" p={2} fontWeight={600} fontSize="10pt">
            <Flex direction="column" width="50%">
              <Text>1</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" width="50%">
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex width="100%" p={1} fontWeight={500} fontSize="10pt">
            <Text>Created March 13, 2022</Text>
          </Flex>
          <Divider />
          <Flex
            direction="column"
            width="100%"
            p={1}
            fontWeight={600}
            fontSize="10pt"
          >
            <Text>Community Topics</Text>
            <Link href={`/r/${router.query.community}/submit`}>
              <Button mt={3} height="30px">
                Create Post
              </Button>
            </Link>
          </Flex>
          <Divider />
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;

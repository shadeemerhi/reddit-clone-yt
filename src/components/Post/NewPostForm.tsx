import React, { useState } from "react";
import { Box, Divider, Flex, Icon, Text } from "@chakra-ui/react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";

type NewPostFormProps = {};

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

const NewPostForm: React.FC<NewPostFormProps> = () => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => {
          const selected = item.title === selectedTab;
          return (
            <Flex
              justify="center"
              align="center"
              flexGrow={1}
              color={selected ? "blue.500" : "gray.500"}
              p="14px 0px"
              cursor="pointer"
              fontWeight={700}
              borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
              borderRightColor="gray.200"
              borderBottomColor={selected ? "blue.500" : "gray.200"}
              _hover={{ bg: "gray.50" }}
              onClick={() => setSelectedTab(item.title)}
            >
              <Flex align="center" height="20px" mr={2}>
                <Icon height="100%" as={item.icon} fontSize={18} />
              </Flex>
              <Text fontSize="10pt">{item.title}</Text>
            </Flex>
          );
        })}
      </Flex>
      <Flex>hello</Flex>
    </Flex>
  );
};
export default NewPostForm;

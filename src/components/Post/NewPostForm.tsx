import { Button, Flex, Icon, Input, Stack, Textarea } from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { firestore } from "../../firebase/clientApp";
import TabItem from "./TabItem";

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

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

type NewPostFormProps = {
  communityId: string;
  userId: string;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ communityId, userId }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [form, setForm] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    setLoading(true);
    const { title, body } = form;
    try {
      const newPostRef = await addDoc(collection(firestore, "posts"), {
        communityId,
        creatorId: userId,
        title,
        body,
        createdAt: serverTimestamp(),
        editedAt: serverTimestamp(),
      });
      console.log("HERE IS NEW POST ID", newPostRef.id);
      setLoading(false);
      setForm({
        title: "",
        body: "",
      });
    } catch (error) {
      console.log("createPost error", error);
    }
  };

  const onChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Stack p={4} spacing={3}>
        <Input
          name="title"
          onChange={onChange}
          _placeholder={{ color: "gray.500" }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "black",
          }}
          fontSize="10pt"
          borderRadius={4}
          placeholder="Title"
        />
        <Textarea
          name="body"
          onChange={onChange}
          fontSize="10pt"
          placeholder="Text (optional)"
          _placeholder={{ color: "gray.500" }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "black",
          }}
          height="100px"
        />
        <Flex justify="flex-end">
          <Button
            height="34px"
            padding="0px 30px"
            disabled={!form.title}
            isLoading={loading}
            onClick={handleCreatePost}
          >
            Post
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
};
export default NewPostForm;

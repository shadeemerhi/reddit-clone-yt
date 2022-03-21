import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestore, storage } from "../../../firebase/clientApp";
import TabItem from "./TabItem";
import { postState } from "../../../atoms/postsAtom";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

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
  user: User;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ communityId, user }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [form, setForm] = useState({
    title: "",
    body: "",
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setPostItems = useSetRecoilState(postState);

  const handleCreatePost = async () => {
    setLoading(true);
    const { title, body } = form;
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId,
        creatorId: user.uid,
        userDisplayText: user.email!.split("@")[0],
        title,
        body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp(),
        editedAt: serverTimestamp(),
      });

      console.log("HERE IS NEW POST ID", postDocRef.id);

      // // check if selectedFile exists, if it does, do image processing
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
        console.log("HERE IS DOWNLOAD URL", downloadURL);
      }

      // Clear the cache to cause a refetch of the posts
      setPostItems((prev) => ({
        ...prev,
        postUpdateRequired: true,
      }));
      router.back();
    } catch (error) {
      console.log("createPost error", error);
      setError("Error creating post");
    }
    setLoading(false);
  };

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
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
      <Flex p={4}>
        {selectedTab === "Post" && (
          <Stack spacing={3} width="100%">
            <Input
              name="title"
              value={form.title}
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
              value={form.body}
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
        )}
        {selectedTab === "Images & Video" && (
          <Flex direction="column" justify="center" align="center" width="100%">
            {selectedFile ? (
              <Flex direction="column" align="center" justify="center">
                <img
                  src={selectedFile as string}
                  style={{ maxWidth: "400px", maxHeight: "400px" }}
                />
                <Stack direction="row" mt={4}>
                  <Button height="28px" onClick={() => setSelectedTab("Post")}>
                    Back to Post
                  </Button>
                  <Button
                    variant="outline"
                    height="28px"
                    onClick={() => setSelectedFile("")}
                  >
                    Remove
                  </Button>
                </Stack>
              </Flex>
            ) : (
              <Flex
                justify="center"
                align="center"
                p={20}
                border="1px dashed"
                borderColor="gray.200"
                borderRadius={4}
                width="100%"
              >
                <Button
                  variant="outline"
                  height="28px"
                  onClick={() => selectFileRef.current?.click()}
                >
                  Upload
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectFileRef}
                  onChange={onSelectImage}
                />
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
export default NewPostForm;

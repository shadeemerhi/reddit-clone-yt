import React, { useCallback, useEffect, useState } from "react";
import { Stack, useClipboard } from "@chakra-ui/react";
import { Community, Post } from "../../atoms/communitiesAtom";
import PostItem from "./PostItem";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";

type PostsProps = {
  communityData: Community;
  userId?: string;
};

const Posts: React.FC<PostsProps> = ({ communityData, userId }) => {
  const [posts, setPosts] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onVote = useCallback(async (post: Post) => {
    const { voteStatus } = post;
    try {
    } catch (error) {
      console.log("onVote error", error);
    }
  }, []);

  const getUserPostVotes = useCallback(async () => {
    try {
      const postVotesQuery = query(
        collection(firestore, `users/${userId}/postVotes`),
        where("communityId", "==", communityData.id)
      );
      const postVotes = await getDocs(postVotesQuery);
      console.log("HERE ARE DOCS", postVotes.docs);
    } catch (error) {}
  }, []);

  useEffect(() => {
    setLoading(true);
    const postsQuery = query(
      collection(firestore, "posts"),
      where("communityId", "==", communityData.id),
      orderBy("createdAt", "desc")
    );

    // Real-time post listener
    const unsubscribe = onSnapshot(postsQuery, (querySnaption) => {
      const posts = querySnaption.docs.map((post) => ({
        id: post.id,
        ...post.data(),
      }));
      console.log("HERE ARE POSTS", posts);
      setPosts(posts as []);
      setLoading(false);
    });

    // get postVotes
    getUserPostVotes();

    // Remove real-time listener on component dismount
    return () => unsubscribe();
  }, [communityData]);

  return (
    <Stack>
      {loading ? (
        <div>WILL ADD LOADERS</div>
      ) : (
        <>
          {posts.map((post: Post) => (
            <PostItem key={post.id} post={post} onVote={onVote} />
          ))}
        </>
      )}
    </Stack>
  );
};
export default Posts;

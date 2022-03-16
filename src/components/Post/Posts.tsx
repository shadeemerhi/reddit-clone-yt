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
  writeBatch,
  doc,
} from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";

type PostVote = {
  id?: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

type PostsProps = {
  communityData: Community;
  userId?: string;
};

const Posts: React.FC<PostsProps> = ({ communityData, userId }) => {
  const [posts, setPosts] = useState([]);
  const [postVotes, setPostVotes] = useState<PostVote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onVote = async (post: Post, vote: number) => {
    const { voteStatus } = post;

    // is this an upvote or a downvote?
    // has this user voted on this post already? was it up or down?
    const existingVote = postVotes.find(
      (item: PostVote) => item.postId === post.id
    );

    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      // New vote
      if (!existingVote) {
        const newVote: PostVote = {
          postId: post.id,
          communityId: communityData.id!,
          voteValue: vote,
        };

        const postVoteRef = doc(
          collection(firestore, "users", `${userId}/postVotes`)
        );

        // Needed for frontend state since we're not getting resource back
        newVote.id = postVoteRef.id;
        batch.set(postVoteRef, {
          postId: post.id,
          communityId: communityData.id!,
          voteValue: vote,
        });

        // Optimistically update state
        setPostVotes((prev) => [...prev, newVote]);
      }
      // Removing existing vote
      else {
        // Used for both possible cases of batch writes
        const postVoteRef = doc(
          firestore,
          "users",
          `${userId}/postVotes/${existingVote.id}`
        );

        // Removing vote
        if (existingVote.voteValue === vote) {
          voteChange *= -1;

          setPostVotes((prev) =>
            prev.filter((item) => item.postId !== post.id)
          );
          batch.delete(postVoteRef);
        }
        // Changing vote
        else {
          voteChange = 2 * vote;

          batch.update(postVoteRef, {
            voteValue: vote,
          });
          // Optimistically update state
          const existingPostIdx = postVotes.findIndex(
            (item) => item.postId === post.id
          );
          const updatedVotes = [...postVotes];
          updatedVotes[existingPostIdx] = { ...existingVote, voteValue: vote };
          setPostVotes(updatedVotes);
        }
      }

      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      /**
       * Perform writes
       * Could move state updates to after this
       * but decided to optimistically update
       */
      await batch.commit();
    } catch (error) {
      console.log("onVote error", error);
    }
  };

  const getUserPostVotes = async () => {
    try {
      const postVotesQuery = query(
        collection(firestore, `users/${userId}/postVotes`),
        where("communityId", "==", communityData.id)
      );

      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostVotes(postVotes as PostVote[]);
      console.log("POST VOTES", postVotes);
    } catch (error) {
      console.log("getUserPostVotes error", error);
    }
  };

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

    // Remove real-time listener on component dismount
    return () => unsubscribe();
  }, [communityData]);

  useEffect(() => {
    if (!userId) return;
    getUserPostVotes();
  }, [communityData, userId]);

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

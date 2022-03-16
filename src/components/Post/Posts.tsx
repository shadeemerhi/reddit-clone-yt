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

enum VoteValue {
  UPVOTE = 1,
  DOWNVOTE = -1,
}

const Posts: React.FC<PostsProps> = ({ communityData, userId }) => {
  const [posts, setPosts] = useState([]);
  const [userVotes, setUserVotes] = useState<PostVote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onVote = async (post: Post, vote: number) => {
    const { voteStatus } = post;
    // is this an upvote or a downvote?
    console.log("HERE IS POST", post, vote);

    // has this user voted on this post already? was it up or down?
    const existingVote = userVotes.find(
      (item: PostVote) => item.postId === post.id
    );
    console.log("HERE IS EXISTING VOTE", existingVote);

    // Check if making same vote
    if (existingVote && existingVote.voteValue === vote) {
      console.log("SAME VOTE - RETURNING");
      return;
    }

    // If existingVote at this point, user is switching their vote
    const voteChange = existingVote ? 2 * vote : vote;

    try {
      const batch = writeBatch(firestore);

      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      const updatedVote: PostVote = {
        postId: post.id,
        communityId: communityData.id!,
        voteValue: vote,
      };
      if (existingVote) {
        const postVoteRef = doc(
          firestore,
          "users",
          `${userId}/postVotes/${existingVote.id}`
        );
        updatedVote.id = existingVote.id;
        batch.update(postVoteRef, {
          voteValue: vote,
        });
      } else {
        const postVoteRef = doc(
          collection(firestore, "users", `${userId}/postVotes`)
        );
        updatedVote.id = postVoteRef.id;
        batch.set(postVoteRef, updatedVote);
      }
      await batch.commit();

      // Update vote state
      if (existingVote) {
        const existingPostIdx = userVotes.findIndex(
          (item) => item.postId === post.id
        );
        const updatedVotes = [...userVotes];
        updatedVotes[existingPostIdx] = updatedVote;
        setUserVotes(updatedVotes);
        return;
      }
      setUserVotes((prev) => [...prev, updatedVote]);
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
      console.log("HERE IS USERID", userId);

      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserVotes(postVotes as PostVote[]);
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

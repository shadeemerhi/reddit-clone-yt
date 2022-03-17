import React, { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import { Community } from "../../atoms/communitiesAtom";
import { firestore } from "../../firebase/clientApp";
import PostLoader from "./Loader";
import { Post, postState, PostVote } from "../../atoms/postsAtom";
import PostItem from "./PostItem";
import { useRouter } from "next/router";

type PostsProps = {
  communityData: Community;
  userId?: string;
  loadingUser: boolean;
};

const Posts: React.FC<PostsProps> = ({
  communityData,
  userId,
  loadingUser,
}) => {
  const [postItems, setPostItems] = useRecoilState(postState);
  const [loading, setLoading] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [error, setError] = useState("");
  const router = useRouter();

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number
  ) => {
    event.stopPropagation();
    if (!userId) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = post;

    // is this an upvote or a downvote?
    // has this user voted on this post already? was it up or down?
    const existingVote = postItems.postVotes.find(
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
        setPostItems((prev) => ({
          ...prev,
          postVotes: [...prev.postVotes, newVote],
        }));
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

          setPostItems((prev) => ({
            ...prev,
            postVotes: prev.postVotes.filter((item) => item.postId !== post.id),
          }));
          batch.delete(postVoteRef);
        }
        // Changing vote
        else {
          voteChange = 2 * vote;

          batch.update(postVoteRef, {
            voteValue: vote,
          });
          // Optimistically update state
          const existingPostIdx = postItems.postVotes.findIndex(
            (item) => item.postId === post.id
          );
          const updatedVotes = [...postItems.postVotes];
          updatedVotes[existingPostIdx] = { ...existingVote, voteValue: vote };
          setPostItems((prev) => ({
            ...prev,
            postVotes: updatedVotes,
          }));
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
      setPostItems((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log("getUserPostVotes error", error);
    }
  };

  const onSelectPost = (post: Post) => {
    setPostItems((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${communityData.id}/comments/${post.id}`);
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
      setPostItems((prev) => ({
        ...prev,
        posts: posts as [],
      }));
      setLoading(false);
    });

    // Remove real-time listener on component dismount
    return () => unsubscribe();
  }, [communityData]);

  useEffect(() => {
    if (!userId && !loadingUser) {
      setPostItems((prev) => ({
        ...prev,
        postVotes: [],
      }));
      return;
    }
    if (!userId) return;
    getUserPostVotes();
  }, [communityData, userId, loadingUser]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postItems.posts.map((post: Post) => (
            <PostItem
              key={post.id}
              post={post}
              onVote={onVote}
              userVoteValue={
                postItems.postVotes.find((item) => item.postId === post.id)
                  ?.voteValue
              }
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;

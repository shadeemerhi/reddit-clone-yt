import React, { useEffect, useState } from "react";
import {
  writeBatch,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Community } from "../atoms/communitiesAtom";

const usePosts = (communityData: Community) => {
  const [user, loadingUser] = useAuthState(auth);
  const [postItems, setPostItems] = useRecoilState(postState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
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
          collection(firestore, "users", `${user.uid}/postVotes`)
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
          `${user.uid}/postVotes/${existingVote.id}`
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
    console.log("WE ARE GETTING POST VOTES!!!");

    try {
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
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
        postsCache: {
          ...prev.postsCache,
          [communityData.id]: {
            ...prev.postsCache[communityData.id],
            postVotes: postVotes as PostVote[],
          },
        },
      }));
    } catch (error) {
      console.log("getUserPostVotes error", error);
    }
  };

  useEffect(() => {
    if (!user?.uid && !loadingUser) {
      setPostItems((prev) => ({
        ...prev,
        postVotes: [],
        postsCache: {
          ...prev.postsCache,
          [communityData.id]: {
            ...prev.postsCache[communityData.id],
            postVotes: [],
          },
        },
      }));
      return;
    }
    if (!user?.uid) return;

    if (postItems.postsCache[communityData.id]?.postVotes.length) {
      setPostItems((prev) => ({
        ...prev,
        postVotes: postItems.postsCache[communityData.id].postVotes,
      }));
      return;
    }
    getUserPostVotes();
  }, [communityData, user, loadingUser]);

  return { postItems, setPostItems, loading, setLoading, onVote, error };
};

export default usePosts;

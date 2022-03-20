import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { Community } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore } from "../firebase/clientApp";

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

    // is this an upvote or a downvote?
    // has this user voted on this post already? was it up or down?

    const { voteStatus } = post;
    const existingVote = postItems.postVotes.find(
      (vote) => vote.postId === post.id
    );

    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      const updatedPost = { ...post };

      // New vote
      if (!existingVote) {
        const newVote: PostVote = {
          postId: post.id,
          communityId: communityData.id!,
          voteValue: vote,
        };

        console.log("NEW VOTE!!!", newVote);
        const postVoteRef = doc(
          collection(firestore, "users", `${user.uid}/postVotes`)
        );

        // Needed for frontend state since we're not getting resource back
        newVote.id = postVoteRef.id;
        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
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

          updatedPost.voteStatus = voteStatus + -vote;

          batch.delete(postVoteRef);
        }
        // Changing vote
        else {
          voteChange = 2 * vote;

          updatedPost.voteStatus = voteStatus + 2 * vote;

          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }

      /**
       * Optimistically update the UI
       * Used for single page view [pid]
       * since we don't have real-time listener there
       */
      // // Optimistically update the UI
      if (postItems.selectedPost) {
        setPostItems((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }

      // Update database
      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();
    } catch (error) {
      console.log("onVote error", error);
    }
  };

  useEffect(() => {
    if (!user?.uid || !communityData) return;
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityData?.id)
    );

    const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
      const postVotes = querySnapshot.docs.map((postVote) => ({
        id: postVote.id,
        ...postVote.data(),
      }));
      console.log("CALLBACK IS FIRING");

      setPostItems((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    });

    return () => unsubscribe();
  }, [user, communityData]);

  useEffect(() => {
    if (!user?.uid && !loadingUser) {
      setPostItems((prev) => ({
        ...prev,
        postVotes: [],
      }));
      return;
    }
  }, [user, loadingUser]);

  return { postItems, setPostItems, loading, setLoading, onVote, error };
};

export default usePosts;

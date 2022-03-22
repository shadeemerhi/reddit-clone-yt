import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { Community } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";
import { useRouter } from "next/router";

const usePosts = (communityData?: Community) => {
  const [user, loadingUser] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSelectPost = (post: Post, postIdx: number) => {
    console.log("HERE IS STUFF", post, postIdx);

    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string,
    postIdx?: number
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = post;
    // const existingVote = post.currentUserVoteStatus;
    const existingVote = postStateValue.postVotes.find(
      (vote) => vote.postId === post.id
    );

    // is this an upvote or a downvote?
    // has this user voted on this post already? was it up or down?

    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];

      // New vote
      if (!existingVote) {
        const newVote: PostVote = {
          postId: post.id,
          communityId,
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

        // updatedPost.currentUserVoteStatus = {
        //   id: postVoteRef.id,
        //   voteValue: vote,
        // };
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
          // delete updatedPost.currentUserVoteStatus;

          batch.delete(postVoteRef);
        }
        // Changing vote
        else {
          voteChange = 2 * vote;
          // We know this will exist here
          // updatedPost.currentUserVoteStatus = {
          //   id: updatedPost.currentUserVoteStatus?.id!,
          //   voteValue: vote,
          // };

          updatedPost.voteStatus = voteStatus + 2 * vote;

          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }

      let updatedState = { ...postStateValue };
      if (postIdx !== undefined) {
        updatedPosts[postIdx] = updatedPost;
        updatedState = {
          ...updatedState,
          posts: updatedPosts,
          postsCache: {
            ...updatedState.postsCache,
            [communityId]: updatedPosts,
          },
        };
      }

      /**
       * Optimistically update the UI
       * Used for single page view [pid]
       * since we don't have real-time listener there
       */
      if (updatedState.selectedPost) {
        updatedState = {
          ...updatedState,
          selectedPost: updatedPost,
        };
      }

      // Optimistically update the UI
      setPostStateValue(updatedState);

      // Update database
      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();
    } catch (error) {
      console.log("onVote error", error);
    }
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    console.log("DELETING POST: ", post.id);

    try {
      // if post has an image url, delete it from storage
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete post from posts collection
      const postDocRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDocRef);

      // Update post state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
        postsCache: {
          ...prev.postsCache,
          [post.communityId]: prev.postsCache[post.communityId]?.filter(
            (item) => item.id !== post.id
          ),
        },
      }));

      /**
       * Cloud Function will trigger on post delete
       * to delete all comments with postId === post.id
       */
      return true;
    } catch (error) {
      console.log("THERE WAS AN ERROR", error);
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
      const postVotes = querySnapshot.docs.map((postVote) => ({
        id: postVote.id,
        ...postVote.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    if (!user?.uid || !communityData) return;
    getCommunityPostVotes(communityData.id);
  }, [user, communityData]);

  /**
   * DO THIS INITIALLY FOR POST VOTES
   */
  // useEffect(() => {
  //   if (!user?.uid || !communityData) return;
  //   const postVotesQuery = query(
  //     collection(firestore, `users/${user?.uid}/postVotes`),
  //     where("communityId", "==", communityData?.id)
  //   );
  //   const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
  //     const postVotes = querySnapshot.docs.map((postVote) => ({
  //       id: postVote.id,
  //       ...postVote.data(),
  //     }));

  //     setPostStateValue((prev) => ({
  //       ...prev,
  //       postVotes: postVotes as PostVote[],
  //     }));
  //   });

  //   return () => unsubscribe();
  // }, [user, communityData]);

  useEffect(() => {
    // Logout or no authenticated user
    if (!user?.uid && !loadingUser) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
      return;
    }
  }, [user, loadingUser]);

  return {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    loading,
    setLoading,
    onVote,
    error,
  };
};

export default usePosts;

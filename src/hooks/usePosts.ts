import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
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
    vote: number,
    postIdx?: number
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = post;
    const existingVote = post.currentUserVoteStatus;

    // is this an upvote or a downvote?
    // has this user voted on this post already? was it up or down?

    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      const updatedPost = { ...post };
      const updatedPosts = [...postItems.posts];

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

        updatedPost.currentUserVoteStatus = {
          id: postVoteRef.id,
          voteValue: vote,
        };
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
          delete updatedPost.currentUserVoteStatus;

          batch.delete(postVoteRef);
        }
        // Changing vote
        else {
          voteChange = 2 * vote;
          // We know this will exist here
          updatedPost.currentUserVoteStatus = {
            id: updatedPost.currentUserVoteStatus?.id!,
            voteValue: vote,
          };

          updatedPost.voteStatus = voteStatus + 2 * vote;

          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }

      let updatedState = { ...postItems };

      if (postIdx !== undefined) {
        console.log("UPDATING THE POST AT INDEX", updatedPost, postIdx);

        updatedPosts[postIdx] = updatedPost;
        updatedState = {
          ...updatedState,
          posts: updatedPosts,
          postsCache: {
            ...updatedState.postsCache,
            [communityData.id]: updatedPosts,
          },
        };
      }

      if (updatedState.selectedPost) {
        updatedState = {
          ...updatedState,
          selectedPost: updatedPost,
        };
      }

      // Optimistically update the UI
      setPostItems(updatedState);

      // Update database
      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
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
      })) as PostVote[];

      setPostItems((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
        votesFetched: true,
      }));
    } catch (error) {
      console.log("getUserPostVotes error", error);
    }
  };

  const addUserVoteStatusToPosts = () => {
    const postsWithUserVoteStatus = postItems.posts.map((post) => {
      const existingVote = postItems.postVotes.find(
        (item) => item.postId === post.id
      );
      if (!existingVote) return post;

      return {
        ...post,
        currentUserVoteStatus: {
          id: existingVote.id,
          voteValue: existingVote.voteValue,
        },
      } as Post;
    });

    let updatedPostState = {
      ...postItems,
      posts: postsWithUserVoteStatus,
    };

    const { selectedPost } = postItems;
    if (postItems.selectedPost) {
      const existingVote = postItems.postVotes.find(
        (item) => item.postId === selectedPost?.id
      );

      if (existingVote) {
        const selectedPostWithUserVoteStatus = {
          ...selectedPost,
          currentUserVoteStatus: {
            id: existingVote.id,
            voteValue: existingVote.voteValue,
          },
        } as Post;
        updatedPostState = {
          ...updatedPostState,
          selectedPost: selectedPostWithUserVoteStatus,
        };
      }

      setPostItems(updatedPostState);
    }

    setPostItems((prev) => ({
      ...prev,
      posts: postsWithUserVoteStatus as Post[],
      postsCache: {
        ...prev.postsCache,
        [communityData.id]: postsWithUserVoteStatus as Post[],
      },
      votesAddedToPosts: true,
    }));
  };

  useEffect(() => {
    const userVotesFetchRequired =
      (postItems.posts.length && !postItems.votesFetched) || // community page load
      (postItems.selectedPost &&
        !postItems.posts.length &&
        !postItems.votesFetched); // single post ([pid]) refresh or initial visit

    if (userVotesFetchRequired) {
      getUserPostVotes();
    }

    if (!user?.uid) return;
  }, [user, postItems.posts, postItems.selectedPost]);

  useEffect(() => {
    if (postItems.postVotes.length && !postItems.votesAddedToPosts) {
      addUserVoteStatusToPosts();
    }
  }, [postItems.postVotes]);

  useEffect(() => {
    if (!user?.uid && !loadingUser) {
      setPostItems((prev) => ({
        ...prev,
        postVotes: [],
        postsCache: {
          ...prev.postsCache,
          [communityData.id]: [],
        },
      }));
      return;
    }
  }, [communityData, user, loadingUser]);

  console.log("HERE IS POST STATE", postItems);

  return { postItems, setPostItems, loading, setLoading, onVote, error };
};

export default usePosts;

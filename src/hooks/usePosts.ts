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
    // const existingVote = postItems.postVotes.find(
    //   (item: PostVote) => item.postId === post.id
    // );

    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      const updatedPost = { ...post };
      const updatedPosts = [...postItems.posts];

      //   updatedPost.voteStatus = post.userVoteStatus ? voteStatus + 2 * vote : voteStatus + vote;
      //   updatedPost.voteStatus = voteStatus + (existingVote ? 2 : 1) * vote;

      // Updating on community page
      //   if (postIdx) {
      //     updatedPosts[postIdx] = updatedPost;
      //   }

      // Optimistically update UI
      //   setPostItems((prev) => ({
      //     ...prev,
      //     posts: updatedPosts,
      //   }));

      // Todo - update on single page view - selectedPost

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

        // const updatedPost = {
        //   ...post,
        //   voteStatus: voteStatus + vote,
        // };

        // // Create a new state object and modify accordingly
        // let updatedPostState = { ...postItems };

        // // Optimistically update state and cache
        // const updatedVotes = [...postItems.postVotes, newVote];
        // updatedPostState = {
        //   ...updatedPostState,
        //   postVotes: updatedVotes,
        //   postsCache: {
        //     ...updatedPostState.postsCache,
        //     [communityData.id]: {
        //       ...updatedPostState.postsCache[communityData.id],
        //       postVotes: updatedVotes,
        //     },
        //   },
        // };

        // Updating post in list of posts
        // if (postIdx) {
        //   const updatedPosts = updatedPostState.posts;
        //   updatedPosts[postIdx] = updatedPost;
        //   updatedPostState = {
        //     ...updatedPostState,
        //     posts: updatedPosts,
        //   };
        // }

        // setPostItems((prev) => ({
        //   ...prev,
        //   selectedPost: updatedPost,
        //   postVotes: updatedVotes,
        //   postsCache: {
        //     ...prev.postsCache,
        //     [communityData.id]: {
        //       ...prev.postsCache[communityData.id],
        //       postVotes: updatedVotes,
        //     },
        //   },
        // }));
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
          console.log("REMOVING EXISTING VOTE!!!");

          updatedPost.voteStatus = voteStatus + -vote;
          delete updatedPost.currentUserVoteStatus;

          //   setPostItems((prev) => ({
          //     ...prev,
          //     postVotes: prev.postVotes.filter((item) => item.postId !== post.id),
          //   }));
          batch.delete(postVoteRef);
        }
        // Changing vote
        else {
          voteChange = 2 * vote;
          console.log("CHANGING EXISTING VOTE!!!");
          // We know this will exist here
          updatedPost.currentUserVoteStatus = {
            id: updatedPost.currentUserVoteStatus?.id!,
            voteValue: vote,
          };

          updatedPost.voteStatus = voteStatus + 2 * vote;

          batch.update(postVoteRef, {
            voteValue: vote,
          });

          // Optimistically update post voteStatus
          //   const existingPostIdx = postItems.posts.findIndex(
          //     (item) => item.id == post.id
          //   );
          //   const updatedPost = {
          //     ...post,
          //     voteStatus: voteStatus + voteChange,
          //   };
          //   const updatedPosts = [...postItems.posts];
          //   updatedPosts[0] = updatedPost;

          // Optimistically update voteValue
          //   const existingVoteIdx = postItems.postVotes.findIndex(
          //     (item) => item.postId === post.id
          //   );
          //   const updatedVotes = [...postItems.postVotes];
          //   updatedVotes[existingVoteIdx] = { ...existingVote, voteValue: vote };
          //   setPostItems((prev) => ({
          //     ...prev,
          //     selectedPost: updatedPost,
          //     postVotes: updatedVotes,
          //     postsCache: {
          //       ...prev.postsCache,
          //       [communityData.id]: {
          //         ...prev.postsCache[communityData.id],
          //         postVotes: updatedVotes,
          //       },
          //     },
          //   }));
        }
      }

      if (postIdx !== undefined) {
        updatedPosts[postIdx] = updatedPost;
        setPostItems((prev) => ({
          ...prev,
          posts: updatedPosts,
          postsCache: {
            ...prev.postsCache,
            [communityData.id]: {
              ...prev.postsCache[communityData.id],
              posts: updatedPosts,
            },
          },
        }));
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
      })) as PostVote[];

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
      };
    });

    setPostItems((prev) => ({
      ...prev,
      posts: postsWithUserVoteStatus as Post[],
      postsCache: {
        ...prev.postsCache,
        [communityData.id]: {
          ...prev.postsCache[communityData.id],
          posts: postsWithUserVoteStatus as Post[],
        },
      },
      votedAdded: true,
    }));
  };

  useEffect(() => {
    // if (postItems.postVotes && postItems.posts && !postItems.votedAdded) {
    //   addUserVoteStatusToPosts();
    // }
    if (!user?.uid) return;
    if (postItems.posts.length && !postItems.postVotes.length) {
      getUserPostVotes();
    }
  }, [postItems.posts, user]);

  useEffect(() => {
    if (postItems.postVotes.length && !postItems.votedAdded) {
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
    // getUserPostVotes();
  }, [communityData, user, loadingUser]);

  console.log("HERE IS POST STATE", postItems);

  return { postItems, setPostItems, loading, setLoading, onVote, error };
};

export default usePosts;

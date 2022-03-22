import { useEffect, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post, PostVote } from "../atoms/postsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import PageContentLayout from "../components/Layout/PageContent";
import PostLoader from "../components/Post/Loader";
import PostItem from "../components/Post/PostItem";
import { auth, firestore } from "../firebase/clientApp";
import usePosts from "../hooks/usePosts";
import useCommunityData from "../hooks/useCommunityData";
import Recommendations from "../components/Community/Recommendations";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  // const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
    loading,
    setLoading,
  } = usePosts();
  const {
    communityStateValue: { mySnippets, initSnippetsFetched },
  } = useCommunityData();

  // WILL NEED TO HANDLE CASE OF NO USER
  const getHomePosts = async () => {
    setLoading(true);
    try {
      /**
       * if snippets has no length (i.e. user not in any communities yet)
       * do query for 20 posts ordered by voteStatus
       */

      const myCommunityIds = mySnippets.map((snippet) => snippet.communityId);

      let postPromises: Array<Promise<QuerySnapshot<DocumentData>>> = [];
      [0, 1, 2].forEach((index) => {
        if (!myCommunityIds[index]) return;

        postPromises.push(
          getDocs(
            query(
              collection(firestore, "posts"),
              where("communityId", "==", myCommunityIds[index]),
              limit(2)
            )
          )
        );
      });

      const queryResults = await Promise.all(postPromises);

      const feedPosts: Post[] = [];
      queryResults.forEach((result) => {
        const posts = result.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        feedPosts.push(...posts);
      });

      console.log("HERE ARE FEED POSTS", feedPosts);

      setPostStateValue((prev) => ({
        ...prev,
        posts: feedPosts,
      }));

      // if not in any, get 5 communities ordered by number of members
      // for each one, get 2 posts ordered by voteStatus and set these to postState posts
    } catch (error: any) {
      console.log("getHomePosts error", error.message);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    const postIds = postStateValue.posts.map((post) => post.id);
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("postId", "in", postIds)
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
    if (!mySnippets.length && initSnippetsFetched) return;
    getHomePosts();
  }, [mySnippets, initSnippetsFetched]);

  useEffect(() => {
    if (!user?.uid || !postStateValue.posts.length) return;
    getUserPostVotes();

    // Clear postVotes on dismount
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [postStateValue.posts, user?.uid]);

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post: Post, index) => (
              <PostItem
                key={post.id}
                post={post}
                postIdx={index}
                onVote={onVote}
                onDeletePost={onDeletePost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                onSelectPost={onSelectPost}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>
        <Recommendations />
      </>
    </PageContentLayout>
  );
};

export default Home;

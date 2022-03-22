import { useEffect, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  Query,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { Post, postState } from "../atoms/postsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import PageContentLayout from "../components/Layout/PageContent";
import PostLoader from "../components/Post/Loader";
import PostItem from "../components/Post/PostItem";
import { auth, firestore } from "../firebase/clientApp";
import useCommunitySnippets from "../hooks/useCommunitySnippets";
import usePosts from "../hooks/usePosts";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const { onVote, onDeletePost } = usePosts();
  const { snippets } = useCommunitySnippets();

  const getHomePosts = async () => {
    setLoading(true);
    try {
      /**
       * if snippets has no length (i.e. user not in any communities yet)
       * do query for 20 posts ordered by voteStatus
       */

      const myCommunityIds = snippets.map((snippet) => snippet.communityId);
      console.log("HERE ARE IDS", myCommunityIds);

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
      console.log("HERE ARE QUERY RESULTS", queryResults);

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

  useEffect(() => {
    if (!snippets.length) return;
    getHomePosts();
  }, [snippets]);

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
                // onSelectPost={onSelectPost}
              />
            ))}
          </Stack>
        )}
      </>
      <>
        <Box>RHS</Box>
      </>
    </PageContentLayout>
  );
};

export default Home;

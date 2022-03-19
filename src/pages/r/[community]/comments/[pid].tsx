import React, { useEffect } from "react";
import { Skeleton, Stack } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Community, communityState } from "../../../../atoms/communitiesAtom";
import { Post, postState } from "../../../../atoms/postsAtom";
import About from "../../../../components/Community/About";
import PageContentLayout from "../../../../components/Layout/PageContent";
import PostLoader from "../../../../components/Post/Loader";
import PostItem from "../../../../components/Post/PostItem";
import { firestore } from "../../../../firebase/clientApp";
import usePosts from "../../../../hooks/usePosts";
import Comments from "../../../../components/Post/Comments";

type PostPageProps = {};

const PostPage: React.FC<PostPageProps> = () => {
  const router = useRouter();
  const { community, pid } = router.query;
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  const setPostItemState = useSetRecoilState(postState);

  const { postItems, loading, setLoading, onVote } = usePosts(
    communityStateValue.visitedCommunities[community as string]
  );

  const fetchPost = async () => {
    setLoading(true);
    try {
      const postDocRef = doc(firestore, "posts", pid as string);

      const postDoc = await getDoc(postDocRef);
      setPostItemState((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async () => {
    setLoading(true);
    try {
      const communityDocRef = doc(
        firestore,
        "communities",
        community as string
      );
      const communityDoc = await getDoc(communityDocRef);
      setCommunityStateValue((prev) => ({
        ...prev,
        visitedCommunities: {
          ...prev.visitedCommunities,
          [community as string]: {
            id: communityDoc.id,
            ...communityDoc.data(),
          } as Community,
        },
      }));
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
  };

  /**
   * Handles the case of refreshing [pid] OR
   * visiting [pid] as a link
   */
  useEffect(() => {
    const { community, pid } = router.query;

    if (community) {
      const communityData =
        communityStateValue.visitedCommunities[community as string];
      if (!communityData) {
        getCommunityData();
        return;
      }
    }

    if (pid && !postItems.selectedPost) {
      fetchPost();
    }

    // Clear selected post state
    return () => {
      setPostItemState((prev) => ({
        ...prev,
        selectedPost: null,
      }));
    };
  }, [router.query, communityStateValue.visitedCommunities]);

  return (
    <PageContentLayout>
      {/* Left Content */}
      <>
        {loading ? (
          <PostLoader />
        ) : (
          <>
            {postItems.selectedPost && (
              <>
                <PostItem
                  post={postItems.selectedPost}
                  postIdx={postItems.selectedPost.postIdx}
                  onVote={onVote}
                  userVoteValue={
                    postItems.selectedPost.currentUserVoteStatus?.voteValue
                  }
                />
                <Comments pid={pid as string} community={community as string} />
              </>
            )}
          </>
        )}
      </>
      {/* Right Content */}
      <>
        <About
          communityData={
            communityStateValue.visitedCommunities[community as string]
          }
          loading={loading}
        />
      </>
    </PageContentLayout>
  );
};
export default PostPage;

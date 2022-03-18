import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../../../../atoms/communitiesAtom";
import { postState } from "../../../../atoms/postsAtom";
import PageContentLayout from "../../../../components/Layout/PageContent";
import PostItem from "../../../../components/Post/PostItem";
import usePosts from "../../../../hooks/usePosts";

type PostPageProps = {};

const PostPage: React.FC<PostPageProps> = () => {
  const router = useRouter();
  // const [postItems, setPostItems] = useRecoilState(postState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const { community } = router.query;
  // console.log("HERE IS POST STATE LOL", postItems);

  const { postItems, loading, setLoading, onVote } = usePosts(
    communityStateValue.visitedCommunities[community as string]
  );

  useEffect(() => {
    /**
     * Will exist if coming from community page
     * If not, means refresh or link visit
     */
    if (!postItems.selectedPost) {
      // Go fetch it and store in recoil state
    }

    if (!communityStateValue.currentCommunity) {
      // Go fetch it and store in recoil state
    }
  }, []);

  return (
    <PageContentLayout>
      {/* Left Content */}
      {postItems.selectedPost && (
        <PostItem
          post={postItems.selectedPost}
          onVote={onVote}
          userVoteValue={
            postItems.postVotes.find(
              (item) => item.postId === postItems.selectedPost!.id
            )?.voteValue
          }
          // onSelectPost={onSelectPost}
        />
      )}
      <></>
      {/* Right Content */}
      <>{/* <About communityData={communityData} /> */}</>
    </PageContentLayout>
  );
};
export default PostPage;

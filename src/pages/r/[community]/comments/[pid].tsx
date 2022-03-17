import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { postState } from "../../../../atoms/postsAtom";
import PageContentLayout from "../../../../components/Layout/PageContent";
import PostItem from "../../../../components/Post/PostItem";

type PostPageProps = {};

const PostPage: React.FC<PostPageProps> = () => {
  const [postItems, setPostItems] = useRecoilState(postState);
  console.log("HERE IS POST STATE LOL", postItems.selectedPost);

  useEffect(() => {
    /**
     * Will exist if coming from community page
     * If not, means refresh or link visit
     */
    if (!postItems.selectedPost) {
      // Go fetch it and store in recoil state
    }
  }, []);

  return (
    <PageContentLayout>
      {/* Left Content */}
      {postItems.selectedPost && (
        <PostItem
          post={postItems.selectedPost}
          // onVote={onVote}
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

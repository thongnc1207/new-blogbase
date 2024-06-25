import { Button, Spinner, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";
import { multiFormatDateString } from "../lib/utils";

export default function PostPage() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { postSlug } = useParams();
  const [postLoading, setPostLoading] = useState(true);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  // const savedPostRecord = currentUser?.favorite.find(
  //   (element) => element === post._id
  // );

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPostLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setPostLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setPostLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setPostLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    if (post != null) {
      setIsSaved(
        !!currentUser?.favorite.find((element) => element === post._id)
      );
    }
  }, [currentUser, post]);

  const handleSave = async (e) => {
    e.stopPropagation();
    setSaving(true);
    setError(null);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      dispatch(updateStart());
      const res = await fetch(`/api/user/save/${post._id}`, {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      if (res.ok) {
        dispatch(updateSuccess(data));
        if (isSaved) {
          setIsSaved(false);
          return;
        }
        setIsSaved(true);
      } else dispatch(updateFailure(data.message));
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", error);
      console.log(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (postLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <>
      {/* <div class="relative h-[306px] overflow-hidden mr-[-5px] ml-[-5px] my-0 p-0 top-0">
            <div class="absolute z-[9] w-full h-full left-0 top-0 bg-shadow-img bg-repeat-x bg-bottom">

            </div>
                            <img class="absolute w-full min-w-[600px] mt-[-50px] blur-sm scale-105 left-0" src="http://localhost:3000/image-proxy?url=http://imgoss.cnu.cc/2401/29/7parevrgalhim0xtek51706494197451.jpg?x-oss-process=style/content"/>
                            <div class="container">
            <h2 class="work-title"> 沉溺于温柔的光</h2>
            <span class="author-info">
                Author:
                <a href="http://www.cnu.cc/users/1001115"><strong> 山风Save</strong></a>
                                    <span class="timeago" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="2024-01-29 10:10:23">5 months ago</span>
                                </span>
                <div class="category">
                    <span class="count" id="recommend_count">Recommend: 131</span>
                                        <span class="count">Read: <span class="read">21596</span></span>
                                        </div>
                </div>
        </div> */}
      <div
        className="relative h-80 bg-fixed bg-top bg-cover"
        style={{
          backgroundImage: post.image[0].includes("imgoss")
            ? `url(http://localhost:3000/image-proxy?url=${post.image[0]}`
            : `url(${post.image[0]}`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Amazing Photos</h1>
            <p className="mt-2 text-lg">Explore our collection.</p>
          </div>
        </div>
      </div>
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post && post.title}
        </h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className="self-center mt-5"
        >
          <Button color="gray" pill size="xs">
            {post && post.category}
          </Button>
        </Link>
        {post.image.map((url, index) =>
          url.includes("imgoss") ? (
            <img
              key={index}
              src={post && `http://localhost:3000/image-proxy?url=${url}`}
              alt={post && post.title}
              className="mt-5 lg:px-[9rem] md:px-[5rem] sm:px-[3rem] px-[1.5rem] max-h-full w-full object-cover"
            />
          ) : (
            <img
              key={index}
              src={post && url}
              alt={post && post.title}
              className="mt-5 lg:px-[9rem] md:px-[5rem] sm:px-[3rem] px-[1.5rem] max-h-full w-full object-cover"
            />
          )
        )}

        <div className="flex p-3 border-b border-slate-500 mx-auto w-full max-w-3xl text-xl">
          {currentUser ? (
            <div className="flex items-center gap-1 text-gray-500 text-xl">
              <img
                className="h-7 w-7 object-cover rounded-full"
                src={currentUser.profilePicture}
                alt=""
              />
              <Link
                to={"/dashboard?tab=profile"}
                className="text-xl text-cyan-600 hover:underline"
              >
                @{currentUser.username}
              </Link>
            </div>
          ) : (
            <></>
          )}
          <span className="ml-3">
            {post &&
              new Date(post.createdAt).toLocaleDateString() +
                " (" +
                multiFormatDateString(post.createdAt) +
                ")"}
          </span>
          <span className="italic ml-auto">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="p-3 max-w-3xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <div className="flex flex-wrap gap-2 justify-end pb-5 max-w-3xl mx-auto w-full">
          <Tooltip
            content={isSaved ? "Remove from favorite" : "Add to favorite"}
            placement="right"
            animation="duration-500"
            style={theme === "light" ? "dark" : "light"}
          >
            {loading ? (
              <Spinner />
            ) : (
              <img
                src={
                  isSaved ? (theme === "light" ?"/assets/icons/saved.svg":"/assets/icons/saved-dark.svg") : (theme === "light" ?"/assets/icons/save.svg":"/assets/icons/save-dark.svg")
                }
                alt="share"
                width={30}
                height={30}
                className="cursor-pointer"
                onClick={(e) => handleSave(e)}
              />
            )}
          </Tooltip>
        </div>
        <div className="max-w-4xl mx-auto w-full">
          <CallToAction />
        </div>
        <CommentSection postId={post._id} />
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="text-xl mt-5">Recent articles</h1>
          <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {recentPosts &&
              recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
          </div>
        </div>
      </main>
    </>
  );
}

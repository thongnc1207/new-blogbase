import React from "react";
import { Button, Tabs, Spinner } from "flowbite-react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";

const isValidObjectId = (id) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

export default function UserWall() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { userId }= useParams();
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState(null);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [follow, setFollow] = useState(false);
  const [following, setFollowing] = useState([]);
  const [invalidId, setInvalidId] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isValidObjectId(userId)) {
      setInvalidId(true);
      return;
    }

    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else if (res.status === 404) {
          setUserNotFound(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, [userId]);

  useEffect(() => {
    if (user && user._id) {
      const fetchFollowing = async () => {
        try {
          const res = await fetch(`/api/user/getfollowing/${user._id}`);
          const data = await res.json();
          console.log(data);
          if (res.ok) {
            setFollowing(data);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchFollowing();
    }
  }, [user]);

  useEffect(() => {
    if (user != null) {
      setFollow(
        !!currentUser?.following.find((element) => element === user._id)
      );
    }
  }, [currentUser, user]);

  const handleSave = async (e) => {
    e.stopPropagation();

    setError(null);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      dispatch(updateStart());
      const res = await fetch(`/api/user/follow/${user._id}`, {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      if (res.ok) {
        dispatch(updateSuccess(data));
        if (follow) {
          setFollow(false);
          return;
        }
        setFollow(true);
      } else dispatch(updateFailure(data.message));
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", error);
      console.log(error.message);
    } finally {
    }
  };

  if (invalidId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">500</h1>
          <p className="text-xl text-gray-600">Internal Server Error</p>
        </div>
      </div>
    );
  }

  if (userNotFound) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">404</h1>
          <p className="text-xl text-gray-600">User Not Found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* User Info Section */}
      <div className="flex items-center mb-4">
        <img
          src={user.profilePicture}
          alt="User Profile"
          className="w-24 h-24 rounded-full mr-4"
        />
        <div>
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <div className="text-gray-600">
            <a className="leading-[14px] ml-0 mr-2.5 my-0 px-2 py-1">
              Following: {following.length}
            </a>
            <a className="leading-[14px] ml-0 mr-2.5 my-0 px-2 py-1">
              Fans: 23
            </a>
            <a className="leading-[14px] ml-0 mr-2.5 my-0 px-2 py-1">
              Recommended: 88
            </a>
          </div>
          <p className="text-gray-800 mt-2">
            Bio: Passionate about technology and software development. Love to
            share my thoughts and ideas.
          </p>
        </div>
        {(!currentUser || currentUser._id !== user._id) &&
          (loading ? (
            <Spinner />
          ) : (
            <div className="ml-auto">
              <Button color="primary" onClick={(e) => handleSave(e)}>
                {currentUser ? (follow ? 'Unfollow' : 'Follow') : 'Follow'}
              </Button>
            </div>
          ))}
      </div>

      {/* Tabs Section */}
      <Tabs aria-label="Tabs with icons" style="underline">
        <Tabs.Item active title="Posts">
          {/* User posts will be rendered here */}
          <div className="flex flex-wrap gap-5 mt-5 justify-start">
            {userPosts &&
              userPosts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        </Tabs.Item>
        <Tabs.Item title="Likes">
          {/* User likes will be rendered here */}
          <div>
            <p className="text-gray-800">Posts liked by the user.</p>
            {/* Example liked post */}
            <div className="mt-4">
              <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold">Liked Post Title</h3>
                <p className="text-gray-600">
                  This is an example of a post liked by the user.
                </p>
              </div>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Followers">
          {/* User followers will be rendered here */}
          <div>
            <p className="text-gray-800">List of followers.</p>
            {/* Example follower */}
            <div className="mt-4">
              <div className="flex items-center bg-white shadow-md rounded-lg p-4 mb-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Follower Profile"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">Follower Name</h3>
                  <p className="text-gray-600">@followerusername</p>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Item>
      </Tabs>
    </div>
  );
}

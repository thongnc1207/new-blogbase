import React from 'react'
import { Button, Tabs } from 'flowbite-react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from "../components/PostCard";


export default function UserWall() {
  const location = useLocation();

  const id = location.state.id;
  const name = location.state.name;
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
      fetchPosts();
    
  }, [id]);
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
          <h2 className="text-2xl font-semibold">{name}</h2>
          <div className="text-gray-600">
            <a className='leading-[14px] ml-0 mr-2.5 my-0 px-2 py-1'>Following: 2</a>
            <a className='leading-[14px] ml-0 mr-2.5 my-0 px-2 py-1'>Fans: 23</a>
            <a className='leading-[14px] ml-0 mr-2.5 my-0 px-2 py-1'>Recommended: 88</a>
          </div>
          <p className="text-gray-800 mt-2">Bio: Passionate about technology and software development. Love to share my thoughts and ideas.</p>
        </div>
        <div className="ml-auto">
          <Button color="primary">Follow</Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs aria-label="Tabs with icons" style="underline">
        <Tabs.Item active title="Posts">
          {/* User posts will be rendered here */}
          <div className="flex flex-wrap gap-5 mt-5 justify-start">
          {userPosts &&
              userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
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
                <p className="text-gray-600">This is an example of a post liked by the user.</p>
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

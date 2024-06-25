import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostCard from '../components/PostCard';

export default function DashFavorite() {
  const { currentUser } = useSelector((state) => state.user);
  const [favorite, setFavorite] = useState([]);
  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const res = await fetch(`/api/user/favorite/${currentUser._id}`);
        const data = await res.json();
        console.log("data: " + data);
        if (res.ok) {
          setFavorite(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchFavorite();
    console.log("hi: " + currentUser._id);
  }, [currentUser._id]);
  return (
    <div className="p-7 flex flex-wrap gap-4">
      {favorite.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

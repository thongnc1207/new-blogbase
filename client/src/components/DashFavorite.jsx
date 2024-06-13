import React from 'react'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function DashFavorite() {
    const { currentUser } = useSelector((state) => state.user);
    const [favorite, setFavorite] = useState([]);
    useEffect(() => {
        const fetchFavorite = async () => {
          try {
            const res = await fetch(`/api/user/favorite/${currentUser._id}`);
            const data = await res.json();
            console.log('data: '+data)
            if (res.ok) {
              setFavorite(data);
              
            }
          } catch (error) {
            console.log(error.message);
          }
        };
        fetchFavorite();
        console.log('hi: '+currentUser._id)
      }, [currentUser._id]);
  return (
    <div>{console.log(favorite)}</div>
  )
}

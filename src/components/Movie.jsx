import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Movie = ({ item }) => {
  const [like, setLike] = useState(false);
  const [url, setUrl] = useState([]);
  const [saved, setSaved] = useState(false);
  const { user } = UserAuth();
  const id = item.id
  const movieID = doc(db, 'users', `${user?.email}`);

  useEffect(() => {
    axios.get(`http://api.themoviedb.org/3/movie/${id}/videos?api_key=e30c3c86e2f40fd337574dc7455c9621`).then((response) => {
      setUrl(response.data.results);
    });
  }, [id]);

  const saveShow = async () => {
    if (user?.email) {
      setLike(!like);
      setSaved(true);
      await updateDoc(movieID, {
        savedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path,
        }),
      });
    } else {
      alert('Please log in to save a movie');
    }
  };
  const newUrl = url[0]

  return (
    <div className='w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2'>
      <img
        className='w-full h-auto block'
        src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
        alt={item?.title}
      />
      <div className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white'>
         <p className='white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center' onClick={()=> window.open(`https://www.youtube.com/watch?v=${newUrl?.key}`, "_blank")}>
          {item?.title} 
        </p>
        <p onClick={saveShow}>
          {like ? (
            <FaHeart className='absolute top-4 left-4 text-gray-300' />
          ) : (
            <FaRegHeart className='absolute top-4 left-4 text-gray-300' />
          )}
        </p>
      </div>
    </div>
  );
};

export default Movie;

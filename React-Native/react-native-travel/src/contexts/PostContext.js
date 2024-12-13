import React, { createContext, useState } from "react";

// PostContext 생성
export const PostContext = createContext();

// PostProvider 작성
export const PostProvider = ({ children }) => {
  const [postList, setPostList] = useState([
    { id: 1, title: "Beautiful Sunset", thumbnail: "https://via.placeholder.com/150?text=Sunset", like: 5, content: "아름다운 석양" },
    { id: 2, title: "Mountain Adventure", thumbnail: "https://via.placeholder.com/150?text=Mountain", like: 8 },
    { id: 3, title: "City Night Lights", thumbnail: "https://via.placeholder.com/150?text=City", like: 3 },
    { id: 4, title: "Forest Getaway", thumbnail: "https://via.placeholder.com/150?text=Forest", like: 10 },
    { id: 5, title: "Ocean Waves", thumbnail: "https://via.placeholder.com/150?text=Ocean", like: 7 },
    { id: 6, title: "Desert Escape", thumbnail: "https://via.placeholder.com/150?text=Desert", like: 2 },
    { id: 7, title: "Snowy Peaks", thumbnail: "https://via.placeholder.com/150?text=Snow", like: 6 },
    { id: 8, title: "Countryside Charm", thumbnail: "https://via.placeholder.com/150?text=Countryside", like: 4 },
    { id: 9, title: "Lakeside Serenity", thumbnail: "https://via.placeholder.com/150?text=Lake", like: 9 },
    { id: 10, title: "Tropical Paradise", thumbnail: "https://via.placeholder.com/150?text=Tropical", like: 12 },
    { id: 11, title: "River Rapids", thumbnail: "https://via.placeholder.com/150?text=River", like: 3 },
    { id: 12, title: "Wild Safari", thumbnail: "https://via.placeholder.com/150?text=Safari", like: 5 },
    { id: 13, title: "Historic Ruins", thumbnail: "https://via.placeholder.com/150?text=Ruins", like: 8 },
    { id: 14, title: "Night Sky", thumbnail: "https://via.placeholder.com/150?text=Night", like: 6 },
    { id: 15, title: "Urban Exploration", thumbnail: "https://via.placeholder.com/150?text=Urban", like: 4 },
    { id: 16, title: "Cozy Cabin", thumbnail: "https://via.placeholder.com/150?text=Cabin", like: 7 },
    { id: 17, title: "Autumn Leaves", thumbnail: "https://via.placeholder.com/150?text=Autumn", like: 11 },
    { id: 18, title: "Underwater World", thumbnail: "https://via.placeholder.com/150?text=Underwater", like: 9 },
    { id: 19, title: "Cherry Blossoms", thumbnail: "https://via.placeholder.com/150?text=Blossoms", like: 8 },
    { id: 20, title: "Rocky Coastline", thumbnail: "https://via.placeholder.com/150?text=Coastline", like: 5 },
    { id: 21, title: "Starlit Desert", thumbnail: "https://via.placeholder.com/150?text=Starlit", like: 7 },
    { id: 22, title: "Rainforest Trek", thumbnail: "https://via.placeholder.com/150?text=Rainforest", like: 4 },
    { id: 23, title: "Winter Wonderland", thumbnail: "https://via.placeholder.com/150?text=Winter", like: 6 },
    { id: 24, title: "Golden Sunrise", thumbnail: "https://via.placeholder.com/150?text=Sunrise", like: 10 },
    { id: 25, title: "Vibrant Market", thumbnail: "https://via.placeholder.com/150?text=Market", like: 2 },
    { id: 26, title: "Hidden Waterfall", thumbnail: "https://via.placeholder.com/150?text=Waterfall", like: 8 },
    { id: 27, title: "Meadow Bliss", thumbnail: "https://via.placeholder.com/150?text=Meadow", like: 5 },
    { id: 28, title: "Colorful Street Art", thumbnail: "https://via.placeholder.com/150?text=StreetArt", like: 9 },
    { id: 29, title: "Peaceful Valley", thumbnail: "https://via.placeholder.com/150?text=Valley", like: 6 },
    { id: 30, title: "Harbor Lights", thumbnail: "https://via.placeholder.com/150?text=Harbor", like: 4 },
  ]);

  return (
    <PostContext.Provider value={{ postList, setPostList }}>
      {children}
    </PostContext.Provider>
  );
};

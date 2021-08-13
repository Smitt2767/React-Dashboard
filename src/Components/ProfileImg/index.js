import React, { useEffect, useState } from "react";
import constants from "../../constants";
const colors = [
  "bg-pink-",
  "bg-purple-",
  "bg-blue-",
  "bg-yellow-",
  "bg-red-",
  "bg-green-",
  "bg-indigo-",
];

const getColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const ProfileImg = ({ username, avatar = null, size = 100 }) => {
  const [color, setColor] = useState("");

  useEffect(() => {
    setColor(getColor());
  }, [username]);

  return (
    <div
      className={`w-12 h-12 text-white ${color}400 rounded-full flex justify-center items-center cursor-pointer hover:${color}500 transform scale-${size} block overflow-hidden`}
    >
      {avatar && avatar !== "user.png" ? (
        <img
          src={`${constants.API_URL}/${avatar}`}
          className="object-cover"
          alt="profile"
        />
      ) : (
        <div className="font-bold text-2xl">{username[0].toUpperCase()}</div>
      )}
    </div>
  );
};

export default ProfileImg;

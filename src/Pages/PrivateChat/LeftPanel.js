import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  clearLeftPanel,
  setLeftPanelPage,
  getUser,
} from "./store/privateChatSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { BsSearch } from "react-icons/bs";

const colors = [
  "bg-pink-",
  "bg-purple-",
  "bg-blue-",
  "bg-yellow-",
  "bg-red-",
  "bg-green-",
  "bg-indigo-",
];

const LeftPanel = () => {
  const { username } = useSelector((state) => state.auth);
  const { leftPanel } = useSelector((state) => state.privateChat);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearLeftPanel());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUsers({ page: leftPanel.page, limit: leftPanel.limit }));
  }, [leftPanel.page, leftPanel.limit, dispatch]);

  const next = () => {
    dispatch(setLeftPanelPage(leftPanel.page + 1));
  };

  const onSearchChange = (value) => {
    setSearch(value);
  };

  const handleUserSearchSubmit = () => {
    // dispatch(getUser(search));
  };

  const getColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const ProfileImg = ({ username }) => {
    return (
      <div
        className={`w-12 h-12 text-white ${getColor()}400 rounded-full flex justify-center items-center cursor-pointer hover:${getColor()}500`}
      >
        <span className="font-bold text-2xl">{username[0].toUpperCase()}</span>
      </div>
    );
  };

  return (
    <div className="h-full w-0 md:w-72 lg:w-96 flex-none flex flex-col p-2 bg-gray-700 text-gray-50">
      <div className="flex-none px-2 py-3 flex items-center border-b-2 border-gray-500">
        <ProfileImg username={username} />
        <h1 className="ml-4 text-2xl tracking-widest font-bold">
          {username.toUpperCase()}
        </h1>
      </div>
      <div className="flex-none px-2 py-5">
        <div className="w-full flex items-center border border-gray-500 rounded-lg p-3">
          <input
            type="text"
            placeholder="Search user..."
            className="w-full bg-transparent focus:outline-none text-lg text-gray-50"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.keyCode === 13) {
                handleUserSearchSubmit();
              }
            }}
          />
          <button className="ml-4 p-1" onClick={handleUserSearchSubmit}>
            <BsSearch className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-gray-600" id="scrollLeftPanel">
        {leftPanel.users.map((user) => {
          return (
            <React.Fragment key={user.user_id}>
              <InfiniteScroll
                dataLength={leftPanel.users.length}
                hasMore={leftPanel.hasMore}
                next={next}
                scrollableTarget="scrollLeftPanel"
              >
                <div
                  className={`w-full flex items-center border-b-2 border-gray-700 px-2 py-3 cursor-pointer hover:bg-gray-800`}
                >
                  <ProfileImg username={user.username} />
                  <div className="flex flex-col ml-4 flex-grow">
                    <h1 className="text-xl tracking-widest font-bold  flex-grow capitalize">
                      {user.username}
                    </h1>
                    <p className="text-gray-400">Last Message</p>
                  </div>
                  <div className="flex flex-none items-center">
                    {
                      <span
                        className={`mr-3 py-1 px-2 text-center text-xs rounded-full bg-gray-500`}
                      >
                        1
                      </span>
                    }
                    {!!user.active && (
                      <span className="h-3 w-3 rounded-full bg-green-400 mr-3"></span>
                    )}
                  </div>
                </div>
              </InfiniteScroll>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LeftPanel;

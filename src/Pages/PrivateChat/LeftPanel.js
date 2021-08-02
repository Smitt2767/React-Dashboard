import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  setLeftPanelPage,
  setCurrentUser,
  clearRightPanel,
  setShowRightPanel,
  setHasMessage,
} from "./store/privateChatSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { BsSearch } from "react-icons/bs";
import ProfileImg from "../../Components/ProfileImg";
import { updateMessagesIsReadStatus } from "../../services/socket";

const LeftPanel = () => {
  const { username } = useSelector((state) => state.auth);
  const { leftPanel, currentUser, showRightPanel } = useSelector(
    (state) => state.privateChat
  );
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!currentUser) updateMessagesIsReadStatus(currentUser.user_id);
  }, [currentUser]);

  useEffect(() => {
    if (!!currentUser) dispatch(setShowRightPanel(true));
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (leftPanel.page === 1) {
      dispatch(getUsers({ page: leftPanel.page, limit: leftPanel.limit }));
      dispatch(setLeftPanelPage(leftPanel.page + 1));
    }
  }, [leftPanel.page, leftPanel.limit, dispatch]);

  const next = () => {
    dispatch(getUsers({ page: leftPanel.page, limit: leftPanel.limit }));
    dispatch(setLeftPanelPage(leftPanel.page + 1));
  };

  const onSearchChange = (value) => {
    setSearch(value);
  };

  const handleUserSearchSubmit = () => {};

  return (
    <div
      className={`h-full w-full md:w-72 lg:w-96 flex flex-col p-2 bg-gray-700 text-gray-50 ${
        showRightPanel ? "hidden md:flex" : "flex"
      } `}
    >
      <div className="flex-none px-2 pt-2 pb-3 flex items-center border-b-2 border-gray-500">
        <ProfileImg username={username} />
        <h1 className="ml-4 text-2xl tracking-widest font-bold">
          {username.toUpperCase()}
        </h1>
      </div>
      <div className="flex-none px-2 py-3">
        <div className="w-full flex items-center border border-gray-500 rounded-lg p-3">
          <input
            type="text"
            placeholder="Search user..."
            className="w-full bg-transparent focus:outline-none text-lg text-gray-50"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter" && e.keyCode === 13) {
            //     handleUserSearchSubmit();
            //   }
            // }}
          />
          <button className="ml-4 p-1" onClick={handleUserSearchSubmit}>
            <BsSearch className="text-2xl" />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-gray-600" id="scrollLeftPanel">
        <InfiniteScroll
          dataLength={leftPanel.users.length}
          hasMore={leftPanel.hasMore}
          next={next}
          scrollableTarget="scrollLeftPanel"
        >
          {leftPanel.users.map((user) => {
            return (
              <React.Fragment key={user.user_id}>
                <div
                  className={`w-full flex items-center  border-gray-700 px-4 py-3 cursor-pointer ${
                    currentUser && currentUser.user_id === user.user_id
                      ? "bg-gray-700 border-l-4 border-b-0 border-blue-400 "
                      : "bg-gray-600 border-b-2"
                  } hover:bg-gray-800`}
                  onClick={() => {
                    dispatch(setCurrentUser(user));
                    dispatch(clearRightPanel());
                    dispatch(setHasMessage(true));
                  }}
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
              </React.Fragment>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default LeftPanel;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  setLeftPanelPage,
  setCurrentUser,
  clearRightPanel,
  setShowRightPanel,
  setHasMessage,
  clearLeftPanel,
  setActiveTab,
  getRooms,
  setCurrentRoom,
  setShowCreateRoomModal,
} from "./store/privateChatSlice";
import CreateRoom from "../../Components/Modal/CreateRoom";
import InfiniteScroll from "react-infinite-scroll-component";
import { BsSearch, BsPlusCircle } from "react-icons/bs";
import ProfileImg from "../../Components/ProfileImg";
import { updateMessagesIsReadStatus } from "../../services/socket";

const LeftPanel = () => {
  const { username } = useSelector((state) => state.auth);
  const {
    leftPanel,
    currentUser,
    showRightPanel,
    activeTab,
    currentRoom,
    showCreateRoomModal,
  } = useSelector((state) => state.privateChat);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setSearch("");
  }, [activeTab]);

  useEffect(() => {
    dispatch(clearLeftPanel());
    dispatch(clearRightPanel());
  }, [search, activeTab, dispatch]);

  useEffect(() => {
    if (!!currentUser) updateMessagesIsReadStatus(currentUser.user_id);
  }, [currentUser]);

  useEffect(() => {
    if (!!currentUser || !!currentRoom) dispatch(setShowRightPanel(true));
  }, [currentUser, currentRoom, dispatch]);

  useEffect(() => {
    if (leftPanel.page === 1) {
      if (activeTab === 0)
        dispatch(
          getUsers({ page: leftPanel.page, limit: leftPanel.limit, search })
        );
      else
        dispatch(
          getRooms({ page: leftPanel.page, limit: leftPanel.limit, search })
        );
      dispatch(setLeftPanelPage(leftPanel.page + 1));
    }
  }, [leftPanel.page, leftPanel.limit, search, activeTab, dispatch]);

  const next = () => {
    if (activeTab === 0)
      dispatch(
        getUsers({ page: leftPanel.page, limit: leftPanel.limit, search })
      );
    else
      dispatch(
        getRooms({ page: leftPanel.page, limit: leftPanel.limit, search })
      );
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
      {showCreateRoomModal && <CreateRoom />}
      <div className="flex-none px-2 pt-2 pb-3 flex items-center border-b-2 border-gray-500">
        <ProfileImg username={username} />
        <h1 className="ml-4 text-2xl tracking-widest font-bold">
          {username.toUpperCase()}
        </h1>
      </div>
      <div className="flex-none flex items-center justify-between px-2 pt-2">
        <div
          className={`cursor-pointer flex-grow text-center  py-2 text-xl capitalize border-r-2 border-gray-700 shadow-xl hover:bg-gray-800 ${
            activeTab === 0 ? "bg-gray-600" : "bg-gray-700"
          }`}
          onClick={() => {
            dispatch(setActiveTab(0));
          }}
        >
          Users
        </div>
        <div
          className={`cursor-pointer flex-grow text-center  py-2 text-xl capitalize shadow-xl hover:bg-gray-800 ${
            activeTab === 1 ? "bg-gray-600" : "bg-gray-700"
          }`}
          onClick={() => {
            dispatch(setActiveTab(1));
          }}
        >
          Rooms
        </div>
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
          />
          <button className="ml-4 p-1" onClick={handleUserSearchSubmit}>
            <BsSearch className="text-2xl" />
          </button>
        </div>
        {activeTab === 1 && (
          <div className="flex justify-center items-center py-2 mt-2">
            <button
              className="shadow-xl flex items-center justify-center w-3/6 rounded-full text-xl bg-gray-600 py-2 px-2 hover:bg-gray-800 hover:text-gray-50 text-gray-200"
              onClick={() => {
                dispatch(setShowCreateRoomModal(true));
              }}
            >
              <BsPlusCircle className="mr-2" /> Create Room
            </button>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-auto bg-gray-600" id="scrollLeftPanel">
        {leftPanel.hasUsers && leftPanel.hasRooms ? (
          !!leftPanel.users.length || !!leftPanel.rooms.length ? (
            <InfiniteScroll
              dataLength={
                activeTab === 0
                  ? leftPanel.users.length
                  : leftPanel.rooms.length
              }
              hasMore={leftPanel.hasMore}
              next={next}
              scrollableTarget="scrollLeftPanel"
            >
              {activeTab === 0
                ? leftPanel.users.map((user) => {
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
                            {!!user.last_message && (
                              <p className="text-gray-400 w-40 truncate">
                                {user.last_message}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-none items-center">
                            {!!user.totalUnRead && (
                              <span
                                className={`mr-3 py-1 px-2 text-center text-xs rounded-full bg-gray-500 truncate`}
                              >
                                {user.totalUnRead}
                              </span>
                            )}
                            {!!user.active && (
                              <span className="h-3 w-3 rounded-full bg-green-400 mr-3"></span>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                : leftPanel.rooms.map((room) => {
                    return (
                      <React.Fragment key={room.room_id}>
                        <div
                          className={`w-full flex items-center  border-gray-700 px-4 py-3 cursor-pointer ${
                            currentRoom && currentRoom.room_id === room.room_id
                              ? "bg-gray-700 border-l-4 border-b-0 border-blue-400 "
                              : "bg-gray-600 border-b-2"
                          } hover:bg-gray-800`}
                          onClick={() => {
                            dispatch(setCurrentRoom(room));
                            dispatch(clearRightPanel());
                            dispatch(setHasMessage(true));
                          }}
                        >
                          <ProfileImg username={room.roomname} />
                          <div className="flex flex-col ml-4 flex-grow">
                            <h1 className="text-xl tracking-widest font-bold  flex-grow capitalize">
                              {room.roomname}
                            </h1>
                            {/* {!!room.last_message && (
                              <p className="text-gray-400 w-40 truncate">
                                {room.last_message}
                              </p>
                            )} */}
                          </div>
                          <div className="flex flex-none items-center">
                            {/* {!!room.totalUnRead && (
                              <span
                                className={`mr-3 py-1 px-2 text-center text-xs rounded-full bg-gray-500 truncate`}
                              >
                                {room.totalUnRead}
                              </span>
                            )} */}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
            </InfiniteScroll>
          ) : (
            <div className="bg-gray-700 w-full h-full">
              <div className="h-full bg-gray-600 w-0 usersLoading "></div>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">
            {activeTab === 0 ? "No Users Found" : "No Rooms Found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;

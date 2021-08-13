import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useSelector, useDispatch } from "react-redux";
import ProfileImg from "../ProfileImg";
import { setErrorMessage, setSuccessMessage } from "../../store/dashboardSlice";
import {
  setShowRoomInfoModal,
  handleExitRoom,
  setIsRoomEdit,
  setShowCreateRoomModal,
} from "../../Pages/PrivateChat/store/privateChatSlice";
import { BsPencil } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";

const RoomInfo = () => {
  const { currentRoom } = useSelector((state) => state.privateChat);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!!currentRoom) {
      const getRoomInfo = async () => {
        try {
          const res = await API.get(`/rooms/${currentRoom.room_id}/users`);
          if (res.status) {
            setUsers([...res.data.data]);
          }
        } catch (e) {
          if (e.response?.data) {
            dispatch(setErrorMessage(e.response?.data.message));
          }
        }
      };
      getRoomInfo();
    }
  }, [currentRoom, dispatch]);

  const hadleExitRoom = async () => {
    if (!!currentRoom) {
      try {
        const res = await API.delete(`/rooms/leave/${currentRoom.room_id}`);
        if (res.status) {
          dispatch(setShowRoomInfoModal(false));
          dispatch(setSuccessMessage(res.data.message));
          dispatch(handleExitRoom());
        }
      } catch (e) {
        if (e.response?.data) {
          dispatch(setErrorMessage(e.response?.data.message));
        }
      }
    }
  };

  return (
    <>
      <div
        className="justify-center items-start mt-20 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none close"
        onClick={(e) => {
          if (e.target.classList.contains("close")) {
            dispatch(setShowRoomInfoModal(false));
          }
        }}
      >
        <div className={`relative w-auto my-6 mx-auto max-w-3xl px-8 md:px-0 `}>
          {/*content*/}
          <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-gray-100 outline-none focus:outline-none px-8 md:px-12 py-4 md:py-8">
            {/*body*/}
            <div className="flex flex-col items-center w-60 md:w-96 ">
              <div className="w-full flex items-center border-b-2 border-gray-300 mb-8">
                <div className="flex items-center flex-grow">
                  <ProfileImg username={currentRoom.roomname} />
                  <h1 className="text-4xl text-gray-700 font-bold py-3 ml-3">
                    {currentRoom.roomname}
                  </h1>
                </div>

                {!!currentRoom.isAdmin && (
                  <button
                    className="flex-none bg-blue-600 hover:bg-blue-700 hover:text-gray-50 rounded-full p-2 shadow-2xl text-gray-200 focus:outline-none text-lg"
                    onClick={() => {
                      dispatch(setShowRoomInfoModal(false));
                      dispatch(setIsRoomEdit(true));
                      dispatch(setShowCreateRoomModal(true));
                    }}
                  >
                    <BsPencil />
                  </button>
                )}
              </div>
              <div className="flex flex-col w-full">
                <p className="text-green-600 font-bold">
                  {users.length} Participatns
                </p>
                <div className="flex flex-col w-full bg-gray-200 mt-2 max-h-72 overflow-auto scrollRightPanel rounded-lg">
                  {!!users.length
                    ? users.map((user, i) => {
                        return (
                          <div
                            className={`w-full flex items-center py-1 ${
                              users.length - 1 !== i
                                ? "border-b-2 border-gray-400"
                                : ""
                            } px-2`}
                            key={user.user_id}
                          >
                            <ProfileImg
                              username={user.username}
                              size={85}
                              avatar={user.avatar}
                            />
                            <h2 className="flex-grow ml-3 text-gray-700 text-xl">
                              {user.username}
                            </h2>
                            {!!user.isAdmin && (
                              <span className="bg-green-400 px-2 py-1 text-xs rounded-full font-bold text-green-900">
                                admin
                              </span>
                            )}
                            {!!user.active && (
                              <span className="h-3 w-3 rounded-full bg-green-400 m-3"></span>
                            )}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
              <button
                onClick={hadleExitRoom}
                className="flex items-center mt-8 bg-red-600 hover:bg-red-700 focus:outline-none text-gray-50 rounded-full shadow-xl py-2 px-4 font-bold"
              >
                <IoExitOutline />
                <span className="ml-3">Exit Room</span>
              </button>
            </div>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 z-30 bg-black"></div>
    </>
  );
};

export default RoomInfo;

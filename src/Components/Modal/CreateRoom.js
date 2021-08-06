import React, { useState, useEffect } from "react";
import CustomAsyncSelect from "../CustomAsyncSelect";
import API from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage, setSuccessMessage } from "../../store/dashboardSlice";
import {
  addRoomToLeftPanel,
  setShowCreateRoomModal,
  updateRoomName,
  setIsRoomEdit,
} from "../../Pages/PrivateChat/store/privateChatSlice";
import _ from "lodash";

const CreateRoom = () => {
  const [roomname, setRoomname] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState({
    roomname: "",
    users: "",
  });
  const { isRoomEdit, currentRoom } = useSelector((state) => state.privateChat);
  const [initialData, setInitialData] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isRoomEdit) {
      const getRoomInfo = async () => {
        try {
          const res = await API.get(`/rooms/${currentRoom.room_id}`);
          if (res.status) {
            setRoomname(currentRoom.roomname);
            setUsers([
              ...res.data.data
                .filter((user) => !user.isAdmin)
                .map((user) => {
                  return {
                    label: user.username,
                    value: user.user_id,
                  };
                }),
            ]);
            setInitialData([
              ...res.data.data
                .filter((user) => !user.isAdmin)
                .map((user) => {
                  return {
                    label: user.username,
                    value: user.user_id,
                  };
                }),
            ]);
          }
        } catch (e) {
          if (e.response?.data) {
            dispatch(setErrorMessage(e.response?.data.message));
          }
        }
      };
      getRoomInfo();
    }
  }, [isRoomEdit, currentRoom, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomname) {
      setError({
        ...error,
        roomname: "Room name must be required...",
      });
    }
    if (!!!users.length) {
      setError({
        ...error,
        users: "Atleast one user is required...",
      });
    }
    if (!roomname || !!!users.length) {
      return;
    }

    try {
      if (!isRoomEdit) {
        const res = await API.post("/rooms", { roomname, users });
        if (res.status && res.data.success) {
          dispatch(setSuccessMessage(res.data.message));
          dispatch(addRoomToLeftPanel(res.data.room));
          setUsers([]);
          setRoomname("");
          setError({
            roomname: "",
            users: "",
          });
          dispatch(setShowCreateRoomModal(false));
        }
      } else {
        const res = await API.put(`/rooms/${currentRoom.room_id}`, {
          roomname,
          users,
        });
        if (res.status) {
          dispatch(setSuccessMessage(res.data.message));
          dispatch(updateRoomName({ roomname, roomId: currentRoom.room_id }));
          setUsers([]);
          setRoomname("");
          setError({
            roomname: "",
            users: "",
          });
          dispatch(setShowCreateRoomModal(false));
          dispatch(setIsRoomEdit(false));
        }
      }
    } catch (err) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
    }
  };

  return (
    <>
      <div
        className="justify-center items-start mt-20 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none close"
        onClick={(e) => {
          if (e.target.classList.contains("close")) {
            dispatch(setShowCreateRoomModal(false));
            if (isRoomEdit) dispatch(setIsRoomEdit(false));
          }
        }}
      >
        <div className={`relative w-auto my-6 mx-auto max-w-3xl px-8 md:px-0 `}>
          {/*content*/}
          <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-gray-100 outline-none focus:outline-none px-8 md:px-12 py-4 md:py-8">
            {/*body*/}
            <div className="flex flex-col items-center w-60 md:w-96 ">
              <div className="w-full flex justify-center border-b-2 border-gray-300 mb-8">
                <h1 className="text-4xl text-gray-700 font-bold py-3">
                  {isRoomEdit
                    ? `Edit Room ${currentRoom.roomname}`
                    : "Create Room"}
                </h1>
              </div>

              <form className="w-full text-gray-700" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full mb-3">
                  <label
                    className="mb-1 font-bold text-lg ml-3"
                    htmlFor="roomname"
                  >
                    Room Name
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 p-3 rounded-md focus:outline-none border-2 border-gray-400"
                    placeholder="Enter Room Name Here..."
                    id="roomname"
                    value={roomname}
                    onChange={(e) => {
                      setRoomname(e.target.value);
                      if (!!!e.target.value)
                        setError({
                          ...error,
                          roomname: "Room name must be required...",
                        });
                      else
                        setError({
                          ...error,
                          roomname: "",
                        });
                    }}
                    onBlur={(e) => {
                      if (!!!e.target.value)
                        setError({
                          ...error,
                          roomname: "Room name must be required...",
                        });
                      else
                        setError({
                          ...error,
                          roomname: "",
                        });
                    }}
                  />
                  {error.roomname && (
                    <span className="ml-3 mt-1 text-red-400 font-bold text-xs">
                      {error.roomname}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full mb-3">
                  <CustomAsyncSelect
                    value={users}
                    onChange={(values) => {
                      setUsers([...values]);
                      if (!!!values.length)
                        setError({
                          ...error,
                          users: "Atleast one user is required...",
                        });
                      else
                        setError({
                          ...error,
                          users: "",
                        });
                    }}
                    isMulti={true}
                    limit={5}
                    id="users"
                    place_holder={"Select Users Here..."}
                    labelName={"Users"}
                    onBlur={() => {
                      if (!!!users.length)
                        setError({
                          ...error,
                          users: "Atleast one user is required...",
                        });
                      else
                        setError({
                          ...error,
                          users: "",
                        });
                    }}
                  />
                  {error.users && (
                    <span className="ml-3 mt-1 text-red-400 font-bold text-xs">
                      {error.users}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center w-full mt-12">
                  <button
                    type="submit"
                    className="bg-blue-600 text-gray-50 text-xl font-bold capitalize  py-3 px-12 rounded-full hover:bg-blue-700 shadow-xl disabled:bg-gray-400"
                    disabled={
                      !roomname ||
                      !!!users.length ||
                      (isRoomEdit &&
                        _.isEqual(initialData, users) &&
                        roomname === currentRoom.roomname)
                    }
                  >
                    {isRoomEdit ? "Save" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default CreateRoom;

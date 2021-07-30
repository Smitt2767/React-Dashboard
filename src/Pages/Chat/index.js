import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setTyper } from "./store/chatSlice";
import { sendMessage, sendTypingData } from "../../services/socket";
import { IoIosSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { FiUsers } from "react-icons/fi";

const Chat = () => {
  const { messages, typer, activeUsers } = useSelector((state) => state.chat);
  const { username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const messageDivRef = useRef();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const handleMessageSend = () => {
    if (!message) return;
    dispatch(addMessage({ byMe: true, message, by: username }));
    sendMessage({ by: username, message });
    if (showEmojiPicker) setShowEmojiPicker(false);
    setMessage("");
  };

  useEffect(() => {
    if (username && message) sendTypingData(username);
  }, [message, username]);

  useEffect(() => {
    if (messageDivRef && messageDivRef.current)
      messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      dispatch(setTyper(""));
    }, [2000]);

    return () => {
      clearTimeout(id);
    };
  }, [typer, dispatch]);

  const handleUsersButtonClick = () => {
    setShowUsers(!showUsers);
  };

  const LeftMessage = ({ message, at, by }) => {
    return (
      <div className="mr-auto flex">
        <div className="bg-purple-700 rounded-full h-8 w-8 flex justify-center align-center mr-1">
          <span className="text-xl text-gray-50">{by[0].toUpperCase()}</span>
        </div>
        <div className="bg-blue-200  px-2 lg:px-4 py-1 lg:py-2 rounded-r-lg rounded-bl-lg flex flex-col mb-4  w-60 overflow-hidden">
          <span className="text-xl mb-1">{message}</span>
          <span className="text-xs text-gray-500 flex justify-between items-center">
            <span>{at}</span>
            <span>{by}</span>
          </span>
        </div>
      </div>
    );
  };
  const RightMessage = ({ message, at }) => {
    return (
      <>
        <div className="ml-auto bg-gray-300 self-end px-2 lg:px-4 py-1 lg:py-2 rounded-l-lg rounded-br-lg flex flex-col mb-4 w-60 overflow-hidden z-10">
          <span className="text-xl mb-1">{message}</span>
          <span className="text-xs text-gray-500 flex justify-between items-center">
            <span>{at}</span>
          </span>
        </div>
      </>
    );
  };

  return (
    <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
      {username && (
        <div className="h-full mx-auto w-full max-w-4xl overflow-hidden flex flex-col items-center rounded-lg shadow-xl">
          <div className="w-full bg-gray-700 px-4 lg:px-8 py-1 lg:py-2 text-xl lg:text-2xl text-gray-50 flex-none flex justify-between overflow-visible relative">
            <span className="">Chat Room</span>
            {activeUsers.length ? (
              <button
                className="focus:outline-none"
                onClick={handleUsersButtonClick}
              >
                <FiUsers />
              </button>
            ) : null}
            {showUsers && activeUsers.length ? (
              <div className="absolute top-10 lg:top-12 right-2 h-72 w-60 shadow-xl border-2 border-gray-200 rounded-lg overflow-y-auto bg-gray-100 z-20">
                {activeUsers.map((user) => {
                  return (
                    <div
                      className="w-full text-gray-700 bg-gray-200 flex items-center px-4 py-2 border-b-2 border-gray-300"
                      key={user.id}
                    >
                      <span className="text-xl text-gray-50 bg-purple-700 rounded-full w-8 h-8 text-center font-bold align-middle mr-4">
                        {user.username[0].toUpperCase()}
                      </span>

                      <span className="text-2xl font-bold ">
                        {user.username}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div
            className="flex-grow h-full overflow-y-auto w-full p-2 bg-gray-100"
            ref={messageDivRef}
          >
            {messages.map((message, i) => {
              return (
                <React.Fragment key={i}>
                  {message.byMe ? (
                    <RightMessage message={message.message} at={message.at} />
                  ) : (
                    <LeftMessage
                      message={message.message}
                      at={message.at}
                      by={message.by}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {typer && (
            <div className="flex-none w-full p-2 text-gray-400 bg-gray-100">
              {typer} is typing...
            </div>
          )}

          <div className="bg-gray-700 flex-none flex items-center w-full p-1 lg:p-2 text-gray-50 relative">
            {showEmojiPicker && (
              <Picker
                pickerStyle={{
                  position: "absolute",
                  top: -330,
                  right: 10,
                  boxShadow: "none",
                }}
                onEmojiClick={(e, emojiObj) => {
                  setMessage(message + emojiObj.emoji);
                }}
              />
            )}
            <div className="flex w-full flex-grow border border-gray-50 px-4 lg:px-2 py-1 lg:py-2 rounded-full mr-2">
              <input
                className="focus:outline-none flex-grow py-1  bg-transparent lg:px-4 "
                placeholder="Type message here..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.keyCode === 13) {
                    handleMessageSend();
                  }
                }}
              />
              {/* <div className="flex-none cursor-pointer mr-2">
                <input
                  className="hidden"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  ref={imageRef}
                  onChange={handleImageChange}
                  multiple
                />
                <AiOutlineCamera
                  className="text-2xl lg:text-3xl"
                  onClick={handleCameraButtonClick}
                />
              </div> */}
              <button
                className="flex-none overflow-hidden"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <GrEmoji className="text-2xl lg:text-3xl" />
              </button>
            </div>

            <button
              className="flex-none border border-gray-50 p-1 lg:p-2 rounded-full"
              onClick={handleMessageSend}
            >
              <IoIosSend className="text-2xl  lg:text-3xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

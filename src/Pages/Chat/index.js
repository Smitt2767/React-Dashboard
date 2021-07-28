import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setUsername,
  setShowModal,
  addMessage,
  setTyper,
} from "./store/chatSlice";
import Form from "../../Components/Modal/Form";
import {
  joinChatRoom,
  sendMessage,
  sendTypingData,
} from "../../services/socket";
import { IoIosSend } from "react-icons/io";

const Chat = () => {
  const { showModal, username, messages, typer } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();
  const messageDivRef = useRef();
  const [message, setMessage] = useState("");

  const handleMessageSend = () => {
    if (!message) return;
    dispatch(addMessage({ byMe: true, message, by: username }));
    sendMessage({ by: username, message });
    setMessage("");
  };

  useEffect(() => {
    if (!username) dispatch(setShowModal(true));
  }, [username, dispatch]);

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

  const handleSubmit = (value) => {
    dispatch(setUsername(value));
    joinChatRoom(value);
  };

  const handleShowModal = (value) => {
    dispatch(setShowModal(value));
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
        <div className="ml-auto bg-gray-300 self-end px-2 lg:px-4 py-1 lg:py-2 rounded-l-lg rounded-br-lg flex flex-col mb-4 w-60 overflow-hidden">
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
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-8">
        Chat
      </h1>

      {showModal && (
        <Form setShowModal={handleShowModal} handleSubmit={handleSubmit} />
      )}

      <div className="h-full mx-auto w-full max-w-xl overflow-hidden flex flex-col items-center rounded-lg shadow-xl">
        <div className="w-full bg-gray-700 px-4 lg:px-8 py-1 lg:py-2 text-xl lg:text-2xl text-gray-50 flex-none">
          Chat Room
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
        <div className="bg-gray-700 flex-none flex items-center w-full p-2 text-gray-50">
          <input
            className="w-full flex-grow bg-transparent focus:outline-none border border-gray-50 rounded-full py-2 px-2 lg:px-4 mr-2"
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
          <button
            className="flex-none border border-gray-50 p-1 lg:p-2 rounded-full"
            onClick={handleMessageSend}
          >
            <IoIosSend className="text-2xl  lg:text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

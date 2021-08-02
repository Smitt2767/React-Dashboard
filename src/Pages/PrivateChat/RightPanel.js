import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileImg from "../../Components/ProfileImg";
import moment from "moment";
import { IoIosSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";

import { AiOutlineClose } from "react-icons/ai";
import {
  BsCheckAll,
  BsArrowLeft,
  BsThreeDotsVertical,
  BsTrash,
  BsPencil,
} from "react-icons/bs";
import {
  getUserMessages,
  setRightPanelPage,
  setShowRightPanel,
  clearLeftPanel,
  clearRightPanel,
  setCurrentUser,
  setNewMessageCome,
  setIsTyping,
} from "./store/privateChatSlice";
import {
  sendMessageToUser,
  sendTypingStatus,
  deleteMessage,
  updateMessage,
} from "../../services/socket";
import InfiniteScroll from "react-infinite-scroll-component";

const RightPanel = () => {
  // refs
  const rightPanelMessageDiv = useRef();

  // state
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessageMenuForMessageId, setShowMessageMenuForMessageId] =
    useState(null);
  const [editId, setEditId] = useState(null);

  // selectors
  const { username } = useSelector((state) => state.auth);
  const { currentUser, rightPanel, showRightPanel } = useSelector(
    (state) => state.privateChat
  );

  const dispatch = useDispatch();

  useEffect(() => {
    let id;
    if (rightPanel.isTyping)
      id = setTimeout(() => {
        dispatch(setIsTyping(false));
      }, [2000]);

    return () => {
      clearTimeout(id);
    };
  }, [rightPanel.isTyping, dispatch]);

  useEffect(() => {
    if (
      rightPanel.newMessageCome &&
      rightPanelMessageDiv &&
      rightPanelMessageDiv.current
    ) {
      rightPanelMessageDiv.current.scrollTop = 0;
      dispatch(setNewMessageCome(false));
    }
  }, [rightPanel.newMessageCome, dispatch]);

  useEffect(() => {
    if (!!currentUser && rightPanel.page === 1) {
      dispatch(
        getUserMessages({
          page: rightPanel.page,
          limit: rightPanel.limit,
          toUserId: currentUser.user_id,
        })
      );
      dispatch(setRightPanelPage(rightPanel.page + 1));
    }
  }, [currentUser, dispatch, rightPanel.page, rightPanel.limit]);

  const handleMessageSend = () => {
    if (!message) return;
    if (editId)
      updateMessage({
        receiverId: currentUser.user_id,
        message,
        messageId: editId,
      });
    else
      sendMessageToUser({
        to_user: currentUser.user_id,
        message,
      });

    if (rightPanelMessageDiv && rightPanelMessageDiv.current)
      rightPanelMessageDiv.current.scrollTop = 0;

    if (showEmojiPicker) setShowEmojiPicker(false);
    setMessage("");
    setEditId(null);
  };

  const next = () => {
    if (!!currentUser) {
      dispatch(
        getUserMessages({
          page: rightPanel.page,
          limit: rightPanel.limit,
          toUserId: currentUser.user_id,
        })
      );
      dispatch(setRightPanelPage(rightPanel.page + 1));
    }
  };

  return (
    <div
      className={`h-full flex-grow bg-gray-100 flex flex-col ${
        showRightPanel ? "flex" : "hidden md:flex"
      }`}
    >
      {!!currentUser ? (
        <>
          <div className="flex-none flex items-center px-5 py-3 bg-gray-700 text-gray-50 ">
            <BsArrowLeft
              className=" flex-none mr-2 text-4xl text-gray-400 cursor-pointer hover:text-gray-50 block md:hidden"
              onClick={() => {
                dispatch(setShowRightPanel(false));
                dispatch(setCurrentUser(null));
                dispatch(clearLeftPanel());
                dispatch(clearRightPanel());
              }}
            />
            <ProfileImg username={currentUser.username} />
            <div className="flex flex-col ml-4 flex-grow">
              <h1 className="text-xl tracking-widest font-bold  flex-grow capitalize">
                {currentUser.username}
              </h1>
              {rightPanel.isTyping ? (
                <p className="text-green-400">Typing...</p>
              ) : !!currentUser.active ? (
                <p className="text-green-400">Online</p>
              ) : (
                <p className="text-gray-400">
                  {`last active ${moment(currentUser.last_active).calendar()}`}
                </p>
              )}
            </div>
          </div>
          {rightPanel.hasMessages ? (
            <div
              className="flex-grow overflow-auto flex flex-col-reverse px-3 py-2"
              id="scrollRightPanel"
              ref={rightPanelMessageDiv}
            >
              {rightPanel.messages.length ? (
                <InfiniteScroll
                  dataLength={rightPanel.messages.length}
                  hasMore={rightPanel.hasMore}
                  next={next}
                  scrollableTarget="scrollRightPanel"
                  style={{ display: "flex", flexDirection: "column-reverse" }}
                  inverse={true}
                  loader={
                    <div className="w-full flex items-center p-2 justify-center ">
                      <div className="sk-chase">
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                        <div className="sk-chase-dot"></div>
                      </div>
                    </div>
                  }
                >
                  {rightPanel.messages.map((message) => {
                    return (
                      <React.Fragment key={message.message_id}>
                        {!!message.by_me ? (
                          // Right Message
                          <div className="self-end mb-4 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden">
                            {showMessageMenuForMessageId ===
                              message.message_id && (
                              <div className="flex items-center justify-end pb-1">
                                <div
                                  className="p-2 bg-blue-500 text-gray-50 mr-1 rounded-full cursor-pointer hover:bg-blue-600"
                                  onClick={() => {
                                    setMessage(message.text);
                                    setEditId(message.message_id);
                                    setShowMessageMenuForMessageId(null);
                                  }}
                                >
                                  <BsPencil />
                                </div>
                                <div
                                  className="p-2 bg-red-500 text-gray-50 rounded-full cursor-pointer hover:bg-red-600"
                                  onClick={() => {
                                    deleteMessage(
                                      message.message_id,
                                      currentUser.user_id
                                    );
                                    setShowMessageMenuForMessageId(null);
                                  }}
                                >
                                  <BsTrash />
                                </div>
                              </div>
                            )}
                            <div className="flex flex-row-reverse">
                              <div className="ml-auto bg-gray-300  px-2 lg:px-4 py-1 lg:py-2 rounded-l-lg rounded-br-lg overflow-hidden z-10 flex message ">
                                <div className="flex-grow flex flex-col w-5/6">
                                  <span className="text-lg mb-0.5 truncate">
                                    {message.text}
                                  </span>
                                  <span className="text-xs text-gray-500 flex justify-between items-center">
                                    <span>
                                      {moment(message.at).format("hh:MM A")}
                                    </span>
                                  </span>
                                </div>
                                <div
                                  className={`flex-none  ${
                                    message.isRead
                                      ? "text-blue-600"
                                      : "text-gray-600"
                                  } text-lg flex flex-col items-between ml-3`}
                                >
                                  <div className="flex-grow">
                                    <BsThreeDotsVertical
                                      className="text-gray-900 cursor-pointer messageMenu hidden"
                                      onClick={() => {
                                        if (showMessageMenuForMessageId)
                                          setShowMessageMenuForMessageId(null);
                                        else
                                          setShowMessageMenuForMessageId(
                                            message.message_id
                                          );
                                        if (
                                          showMessageMenuForMessageId !==
                                          message.message_id
                                        )
                                          setShowMessageMenuForMessageId(
                                            message.message_id
                                          );
                                      }}
                                    />
                                  </div>
                                  <BsCheckAll className="flex-none" />
                                </div>
                              </div>
                              {!!message.isEdited && (
                                <div className="m-2 text-xl hover:text-gray-900 text-gray-600 ">
                                  <BsPencil />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Left message
                          <div className="self-start mb-4 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                            {showMessageMenuForMessageId ===
                              message.message_id && (
                              <div className="flex items-center justify-end pb-1">
                                {/* <div className="p-2 bg-red-500 text-gray-50 rounded-full cursor-pointer hover:bg-red-600">
                                  <BsTrash />
                                </div> */}
                              </div>
                            )}
                            <div className="flex">
                              <div className="bg-blue-200 px-2 lg:px-4 py-1 lg:py-2 rounded-r-lg rounded-bl-lg overflow-hidden flex message">
                                <div className="flex-grow flex flex-col w-5/6">
                                  <span className="text-lg mb-0.5 truncate ">
                                    {message.text}
                                  </span>
                                  <span className="text-xs text-gray-500 flex justify-between items-center">
                                    <span>
                                      {moment(message.at).format("hh:MM A")}
                                    </span>
                                  </span>
                                </div>
                                <div
                                  className={`flex-nonetext-lg flex flex-col items-between ml-3`}
                                >
                                  <div className="flex-grow">
                                    <BsThreeDotsVertical
                                      className="text-gray-900 cursor-pointer messageMenu hidden"
                                      onClick={() => {
                                        if (showMessageMenuForMessageId)
                                          setShowMessageMenuForMessageId(null);
                                        else
                                          setShowMessageMenuForMessageId(
                                            message.message_id
                                          );
                                      }}
                                    />
                                  </div>
                                  <div className="w-4"></div>
                                </div>
                              </div>
                              {!!message.isEdited && (
                                <div className="m-2 text-xl hover:text-gray-900 text-gray-600 ">
                                  <BsPencil />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </InfiniteScroll>
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  <div className="w-full flex items-center p-2 justify-center ">
                    <div className="sk-chase">
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center text-gray-400 captitalize text-lg tracking-widest ">
              There is no messages send some messages to user...
            </div>
          )}

          <div className="flex-none ">
            <div className="bg-gray-700 flex-none flex items-center w-full p-2 text-gray-50 relative z-20">
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
              <div className="flex w-full flex-grow border border-gray-50 px-4 lg:px-2 py-2 rounded-full mr-2">
                <input
                  className="focus:outline-none flex-grow py-1 bg-transparent lg:px-4 "
                  placeholder={`${
                    editId ? "Upadte message here..." : "Type message here..."
                  }`}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    sendTypingStatus(currentUser.user_id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.keyCode === 13) {
                      handleMessageSend();
                    }
                  }}
                />

                <button
                  className={`flex-none overflow-hidden ${
                    !!editId ? "mr-3" : ""
                  }`}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <GrEmoji className="text-2xl lg:text-3xl" />
                </button>

                {!!editId && (
                  <button
                    className="flex-none overflow-hidden rounded-full border border-gray-200 p-1 md:p-2 hover:border-gray-50"
                    onClick={() => {
                      setMessage("");
                      setEditId(null);
                    }}
                  >
                    <AiOutlineClose className="text-xl lg:text-lg" />
                  </button>
                )}
              </div>

              <button
                className="flex-none border border-gray-50 p-2 rounded-full"
                onClick={handleMessageSend}
              >
                <IoIosSend className="text-2xl  lg:text-3xl" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-700 text-gray-400">
          <div className="flex flex-col items-center w-96">
            <ProfileImg username={username} size={200} />
            <h1 className="mt-8 text-6xl text-gray-100 tracking-widest uppercase">
              Hi, {username}
            </h1>
            <p className="mt-2 tracking-wider capitalize">
              Welcome, to private chat...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;

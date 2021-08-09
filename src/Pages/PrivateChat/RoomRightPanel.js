import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileImg from "../../Components/ProfileImg";
import { BsArrowLeft, BsInfoCircle } from "react-icons/bs";
import {
  setShowRoomInfoModal,
  setCurrentRoom,
  setShowRightPanel,
  clearLeftPanel,
  clearRightPanel,
  getRoomMessages,
  setRightPanelPage,
  setNewMessageCome,
  setWhoIsTyping,
} from "./store/privateChatSlice";
import RoomRightMessage from "./RoomRightMessage";
import RoomLeftMessage from "./RoomLeftMessage";
import RoomInfo from "../../Components/Modal/RoomInfo";
import { IoIosSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import constants from "../../constants";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaQuoteLeft } from "react-icons/fa";
import { MentionsInput, Mention } from "react-mentions";
import {
  roomNewMessage,
  sendWhoIsTyoing,
  updateRoomMessage,
} from "../../services/socket";
import API from "../../services/api";
const RoomRightPanel = () => {
  // refs
  const rightPanelMessageDiv = useRef();

  // States
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessageMenuForMessageId, setShowMessageMenuForMessageId] =
    useState(null);
  const [action, setAction] = useState({
    type: constants.actionTypes.CREATE,
    id: null,
    message: null,
    isLast: false,
  });

  const { username } = useSelector((state) => state.auth);
  const { currentRoom, showRightPanel, showRoomInfoModal, rightPanel } =
    useSelector((state) => state.privateChat);
  const dispatch = useDispatch();

  const handleMessageSend = () => {
    if (!message) return;

    if (action.type === constants.actionTypes.CREATE) {
      roomNewMessage({
        room_id: currentRoom.room_id,
        message,
      });
    }
    if (action.type === constants.actionTypes.EDIT)
      updateRoomMessage({
        room_id: currentRoom.room_id,
        message,
        message_id: action.id,
        isLast: action.isLast,
      });
    if (action.type === constants.actionTypes.REPLY)
      roomNewMessage({
        room_id: currentRoom.room_id,
        message,
        replyOf: action.id,
      });

    setMessage("");
    setAction({
      type: constants.actionTypes.CREATE,
      id: null,
      message: null,
      isLast: false,
    });
    if (showEmojiPicker) setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (!!currentRoom && rightPanel.page === 1) {
      dispatch(
        getRoomMessages({
          page: rightPanel.page,
          limit: rightPanel.limit,
          room_id: currentRoom.room_id,
        })
      );
      dispatch(setRightPanelPage(rightPanel.page + 1));
    }
  }, [currentRoom, dispatch, rightPanel.page, rightPanel.limit]);

  useEffect(() => {
    let id;
    if (!!rightPanel.whoIsTyping)
      id = setTimeout(() => {
        dispatch(setWhoIsTyping(null));
      }, [2000]);

    return () => {
      clearTimeout(id);
    };
  }, [rightPanel.whoIsTyping, dispatch]);

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

  const next = () => {
    if (!!currentRoom) {
      dispatch(
        getRoomMessages({
          page: rightPanel.page,
          limit: rightPanel.limit,
          room_id: currentRoom.room_id,
        })
      );
      dispatch(setRightPanelPage(rightPanel.page + 1));
    }
  };

  const onAction = (action) => {
    setAction({
      ...action,
    });
  };

  const fetchRoomUsers = async (query, callback) => {
    try {
      const res = await API.get(`/rooms/${currentRoom.room_id}`);
      if (res.status) {
        callback(
          res.data.data.map((user) => {
            return {
              id: user.user_id,
              display: user.username,
            };
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={`h-full flex-grow bg-gray-100 flex flex-col  ${
        showRightPanel ? "flex" : "hidden lg:flex"
      }`}
    >
      {showRoomInfoModal && <RoomInfo />}
      {currentRoom ? (
        <>
          <div className="flex-none flex items-center px-4 py-2 md:px-5 md:py-3 bg-gray-700 text-gray-50 ">
            <BsArrowLeft
              className="flex-none mr-2 text-3xl text-gray-400 cursor-pointer hover:text-gray-50 block lg:hidden"
              onClick={() => {
                dispatch(setShowRightPanel(false));
                dispatch(setCurrentRoom(null));
                dispatch(clearLeftPanel());
                dispatch(clearRightPanel());
              }}
            />
            <ProfileImg username={currentRoom.roomname} />
            <div className="flex flex-col ml-4 flex-grow">
              <h1 className="text-xl tracking-widest font-bold  flex-grow capitalize">
                {currentRoom.roomname}
              </h1>
              {!!rightPanel.whoIsTyping && (
                <span className="text-green-500 text-sm font-bold">
                  {rightPanel.whoIsTyping} is typing...
                </span>
              )}
            </div>
            <BsInfoCircle
              className="flex-none mr-2 text-3xl text-gray-400 cursor-pointer hover:text-gray-50 "
              onClick={() => {
                dispatch(setShowRoomInfoModal(true));
              }}
            />
          </div>
          {/* Body */}
          {rightPanel.hasMessages ? (
            <div
              className="flex-grow overflow-auto flex flex-col-reverse px-3 py-2 scrollRightPanel"
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
                  {rightPanel.messages.map((message, i) => {
                    return (
                      <React.Fragment key={message.message_id}>
                        {moment(message.created_at).format("DD") !==
                          moment(rightPanel.messages[i - 1]?.created_at).format(
                            "DD"
                          ) && (
                          <div className="w-full flex justify-center items-center mb-4">
                            <span className="bg-gray-300 text-gray-700 px-3 py-1 font-bold text-sm rounded-full">
                              {moment(
                                rightPanel.messages[i - 1]?.created_at
                              ).format("DD - MMM")}
                            </span>
                          </div>
                        )}
                        {!!message.by_me ? (
                          <RoomRightMessage
                            message={message}
                            showMessageMenuForMessageId={
                              showMessageMenuForMessageId
                            }
                            setMessage={setMessage}
                            onAction={onAction}
                            setShowMessageMenuForMessageId={
                              setShowMessageMenuForMessageId
                            }
                            action={action}
                            isLast={
                              rightPanel.messages[0].message_id ===
                              message.message_id
                            }
                          />
                        ) : (
                          <RoomLeftMessage
                            message={message}
                            showMessageMenuForMessageId={
                              showMessageMenuForMessageId
                            }
                            setShowMessageMenuForMessageId={
                              setShowMessageMenuForMessageId
                            }
                            onAction={onAction}
                            action={action}
                          />
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
            <div className="w-full h-full flex justify-center items-center text-gray-400 captitalize text-lg tracking-widest text-center ">
              There is no messages send some messages to user...
            </div>
          )}
          {constants.actionTypes.REPLY === action.type && (
            <div className="flex-none border-b border-gray-500 text-gray-50 bg-gray-700 px-6 py-3 flex rounded-t-2xl">
              <FaQuoteLeft className="mr-4 items-start" />
              <div className="">{action.message}</div>
            </div>
          )}
          {/* Footer */}
          <div className="flex-none ">
            <div className="bg-gray-700 flex-none flex items-center w-full p-2 text-gray-50 relative z-20">
              {showEmojiPicker && (
                <Picker
                  pickerStyle={{
                    position: "absolute",
                    top: -330,
                    left: 10,
                    boxShadow: "none",
                  }}
                  onEmojiClick={(e, emojiObj) => {
                    setMessage(message + emojiObj.emoji);
                  }}
                />
              )}

              <div className="flex items-center x w-full flex-grow border border-gray-50 px-4 lg:px-2 py-2 rounded-full mr-2">
                <button
                  className={`flex-none mr-3`}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <GrEmoji className="text-2xl lg:text-3xl " />
                </button>
                {/* <input
                  className="focus:outline-none flex-grow py-0 md:py-1 bg-transparent lg:px-4 "
                  placeholder={`${
                    action.type === constants.actionTypes.EDIT
                      ? "Upadte message here..."
                      : action.type === constants.actionTypes.REPLY
                      ? "Reply message here..."
                      : "Type message here..."
                  }`}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    sendWhoIsTyoing(currentRoom.room_id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.keyCode === 13) {
                      handleMessageSend();
                    }
                  }}
                /> */}
                <MentionsInput
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    sendWhoIsTyoing(currentRoom.room_id);
                  }}
                  placeholder={`${
                    action.type === constants.actionTypes.EDIT
                      ? "Upadte message here..."
                      : action.type === constants.actionTypes.REPLY
                      ? "Reply message here..."
                      : "Type message here..."
                  }`}
                  allowSuggestionsAboveCursor
                  className="mentionsInput flex-grow scrollRightPanel"
                  singleLine
                >
                  <Mention
                    displayTransform={(id, display) => display}
                    trigger="@"
                    data={fetchRoomUsers}
                    markup=" @__display__ "
                    appendSpaceOnAdd
                  />
                </MentionsInput>

                {(action.type === constants.actionTypes.EDIT ||
                  action.type === constants.actionTypes.REPLY) && (
                  <button
                    className="flex-none overflow-hidden rounded-full border border-gray-200 p-1 md:p-2 hover:border-gray-50"
                    onClick={() => {
                      setMessage("");
                      setAction({
                        type: constants.actionTypes.CREATE,
                        id: null,
                        message: null,
                        isLast: false,
                      });
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

export default RoomRightPanel;

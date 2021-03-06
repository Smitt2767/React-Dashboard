import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileImg from "../../Components/ProfileImg";
import moment from "moment";
import { IoIosSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import FilesSection from "./FilesSection";
import { v4 as uuidV4 } from "uuid";
import {
  getUserMessages,
  setRightPanelPage,
  setShowRightPanel,
  clearLeftPanel,
  clearRightPanel,
  setCurrentUser,
  setNewMessageCome,
  setIsTyping,
  setIsLoading,
} from "./store/privateChatSlice";
import {
  sendMessageToUser,
  sendTypingStatus,
  deleteMessage,
  updateMessage,
} from "../../services/socket";
import InfiniteScroll from "react-infinite-scroll-component";
import RightMessage from "./RightMessage";
import LeftMessage from "./LeftMessage";
import constants from "../../constants";
import API from "../../services/api";
import { FaQuoteLeft } from "react-icons/fa";
import { IoMdAttach } from "react-icons/io";
import RightFilesMessage from "./RightFilesMessage";
import LeftFileMessage from "./LeftFilesMessage";
const RightPanel = () => {
  // refs
  const rightPanelMessageDiv = useRef();
  const galleryRef = useRef();
  // state
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
  const [files, setFiles] = useState([]);

  // selectors
  const { username } = useSelector((state) => state.auth);
  const { currentUser, rightPanel, showRightPanel } = useSelector(
    (state) => state.privateChat
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!!currentUser) {
      setMessage("");
      setShowEmojiPicker(false);
      setShowMessageMenuForMessageId(null);
      setAction({
        type: constants.actionTypes.CREATE,
        id: null,
        message: null,
        isLast: false,
      });
      setFiles([]);
    }
  }, [currentUser]);

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

  const handleMessageSend = async () => {
    if (!message && !!!files.length) return;

    dispatch(setIsLoading(true));

    if (!!files.length) {
      try {
        const formData = new FormData();
        formData.append("to_user", currentUser.user_id);
        files.forEach((file) => {
          formData.append("file", file);
        });

        await API.post("/chat/files", formData);
      } catch (err) {
        console.log(err);
      }
    } else {
      if (action.type === constants.actionTypes.EDIT)
        updateMessage({
          receiverId: currentUser.user_id,
          message,
          messageId: action.id,
          isLast: action.isLast,
        });
      else if (action.type === constants.actionTypes.REPLY)
        sendMessageToUser({
          to_user: currentUser.user_id,
          message,
          replyOf: action.id,
        });
      else
        sendMessageToUser({
          to_user: currentUser.user_id,
          message,
          files,
        });
    }

    if (rightPanelMessageDiv && rightPanelMessageDiv.current)
      rightPanelMessageDiv.current.scrollTop = 0;

    if (showEmojiPicker) setShowEmojiPicker(false);
    setMessage("");
    setAction({
      type: constants.actionTypes.CREATE,
      id: null,
      message: null,
      isLast: false,
    });
    setFiles([]);
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

  const onAction = (action) => {
    setAction({
      ...action,
    });
  };

  return (
    <div
      className={`h-full flex-grow bg-gray-100 flex flex-col ${
        showRightPanel ? "flex" : "hidden lg:flex"
      }`}
    >
      {!!currentUser ? (
        <>
          <div className="flex-none flex items-center justify-between px-4 py-2 md:px-5 md:py-3 bg-gray-700 text-gray-50 ">
            <div className="flex-grow flex items-center">
              <BsArrowLeft
                className="flex-none mr-2 text-3xl text-gray-400 cursor-pointer hover:text-gray-50 block lg:hidden"
                onClick={() => {
                  dispatch(setShowRightPanel(false));
                  dispatch(setCurrentUser(null));
                  dispatch(clearLeftPanel());
                  dispatch(clearRightPanel());
                }}
              />
              <ProfileImg
                username={currentUser.username}
                avatar={currentUser.avatar}
              />
              <div className="flex flex-col ml-4 flex-grow">
                <h1 className="text-xl tracking-widest font-bold  flex-grow capitalize">
                  {currentUser.username}
                </h1>
                {rightPanel.isTyping ? (
                  <p className="text-green-400">Typing...</p>
                ) : !!currentUser.active ? (
                  <p className="text-green-400">Online</p>
                ) : (
                  <p className="text-gray-400 text-sm md:text-md">
                    {`last active ${moment(
                      currentUser.last_active
                    ).calendar()}`}
                  </p>
                )}
              </div>
            </div>
          </div>
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
                          message.type === "text" ? (
                            <RightMessage
                              message={message}
                              showMessageMenuForMessageId={
                                showMessageMenuForMessageId
                              }
                              setMessage={setMessage}
                              onAction={onAction}
                              setShowMessageMenuForMessageId={
                                setShowMessageMenuForMessageId
                              }
                              deleteMessage={deleteMessage}
                              action={action}
                              isLast={
                                rightPanel.messages[0].message_id ===
                                message.message_id
                              }
                            />
                          ) : (
                            <RightFilesMessage
                              message={message}
                              showMessageMenuForMessageId={
                                showMessageMenuForMessageId
                              }
                              isLast={
                                rightPanel.messages[0].message_id ===
                                message.message_id
                              }
                              deleteMessage={deleteMessage}
                              setShowMessageMenuForMessageId={
                                setShowMessageMenuForMessageId
                              }
                            />
                          )
                        ) : message.type === "text" ? (
                          <LeftMessage
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
                        ) : (
                          <LeftFileMessage
                            message={message}
                            showMessageMenuForMessageId={
                              showMessageMenuForMessageId
                            }
                            isLast={
                              rightPanel.messages[0].message_id ===
                              message.message_id
                            }
                            setShowMessageMenuForMessageId={
                              setShowMessageMenuForMessageId
                            }
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

              {!!files.length && !rightPanel.isLoading && (
                <FilesSection
                  files={files}
                  setFiles={setFiles}
                  galleryRef={galleryRef}
                />
              )}

              <div className="flex items-center x w-full flex-grow border border-gray-50 px-4 lg:px-2 py-2 rounded-full mr-2">
                <button
                  className={`flex-none mr-3`}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={!!files.length}
                >
                  <GrEmoji className="text-2xl lg:text-3xl " />
                </button>
                <input
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
                    sendTypingStatus(currentUser.user_id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.keyCode === 13) {
                      handleMessageSend();
                    }
                  }}
                  disabled={!!files.length}
                />

                <button
                  className="flex-none mr-1 md:mr-3"
                  onClick={() => {
                    if (galleryRef.current) galleryRef.current.click();
                  }}
                >
                  <input
                    type="file"
                    accept="image/*, .pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    ref={galleryRef}
                    multiple
                    onChange={(e) => {
                      if (e.target.files.length) {
                        const data = Object.values(e.target.files).map(
                          (file) => {
                            file.preview = file.type.startsWith("image/")
                              ? URL.createObjectURL(file)
                              : null;
                            file.id = uuidV4();
                            return file;
                          }
                        );
                        setFiles([...files, ...data]);
                      }
                    }}
                  />
                  <IoMdAttach className="text-2xl transform rotate-45" />
                </button>

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
                disabled={rightPanel.isLoading}
              >
                {rightPanel.isLoading ? (
                  <div className="h-full w-full flex justify-center items-center">
                    <div className="w-full flex items-center  justify-center ">
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
                ) : (
                  <IoIosSend className="text-2xl  lg:text-3xl" />
                )}
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

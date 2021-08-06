import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  BsCheckAll,
  BsThreeDotsVertical,
  BsTrash,
  BsPencil,
  BsReply,
} from "react-icons/bs";
import constants from "../../constants";

const RoomRightMessage = ({
  message,
  showMessageMenuForMessageId,
  setMessage,
  onAction,
  setShowMessageMenuForMessageId,
  deleteMessage,
  action,
}) => {
  const { currentUser } = useSelector((state) => state.privateChat);

  return (
    <div
      className="self-end mb-4 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden"
      id={`message_${message.message_id}`}
    >
      {showMessageMenuForMessageId === message.message_id && (
        <div className="flex items-center justify-end pb-1">
          <div
            className="p-2 bg-gray-500 text-gray-50 mr-1 rounded-full cursor-pointer hover:bg-gray-600"
            onClick={() => {
              onAction({
                type: constants.actionTypes.REPLY,
                id: message.message_id,
                message: message.text,
              });
              setShowMessageMenuForMessageId(null);
            }}
          >
            <BsReply />
          </div>
          <div
            className="p-2 bg-blue-500 text-gray-50 mr-1 rounded-full cursor-pointer hover:bg-blue-600"
            onClick={() => {
              setMessage(message.text);
              onAction({
                ...action,
                type: constants.actionTypes.EDIT,
                id: message.message_id,
              });
              setShowMessageMenuForMessageId(null);
            }}
          >
            <BsPencil />
          </div>
          <div
            className="p-2 bg-red-500 text-gray-50 rounded-full cursor-pointer hover:bg-red-600"
            onClick={() => {
              setShowMessageMenuForMessageId(null);
            }}
          >
            <BsTrash />
          </div>
        </div>
      )}
      <div className="flex flex-row-reverse">
        <div className="ml-auto bg-gray-300  px-2 lg:px-4 py-1 lg:py-2 rounded-l-lg rounded-br-lg overflow-hidden z-10 message flex-col flex ">
          {!!message.replyOf && (
            <a
              className="text-gray-700 pt-1 pb-3 mb-1 border-b-2 border-gray-500 w-full truncate "
              href={`#message_${message.replyOf}`}
            >
              <span className="text-lg mb-0.5  font-bold border-l-4 border-gray-700 px-3 py-1">
                {message.replyText}
              </span>
            </a>
          )}
          <div className="flex">
            <div className="flex-grow flex flex-col w-5/6">
              <span className="text-lg mb-0.5 truncate">{message.text}</span>
              <span className="text-xs text-gray-500 flex justify-between items-center">
                <span>{moment(message.created_at).format("hh:mm A")}</span>
              </span>
            </div>
            <div
              className={`flex-none py-1  ${
                message.isRead ? "text-blue-600" : "text-gray-600"
              } text-lg flex flex-col items-between ml-3`}
            >
              <div className="flex-grow">
                <BsThreeDotsVertical
                  className="text-gray-900 text-sm cursor-pointer messageMenu block lg:hidden"
                  onClick={() => {
                    if (showMessageMenuForMessageId)
                      setShowMessageMenuForMessageId(null);
                    else setShowMessageMenuForMessageId(message.message_id);
                    if (showMessageMenuForMessageId !== message.message_id)
                      setShowMessageMenuForMessageId(message.message_id);
                  }}
                />
              </div>
              <div className="w-4 flex-none"></div>
            </div>
          </div>
        </div>
        {!!message.isEdited && (
          <div className="m-2 text-xl hover:text-gray-900 text-gray-600 ">
            <BsPencil />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomRightMessage;

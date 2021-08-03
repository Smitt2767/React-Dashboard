import React from "react";
import moment from "moment";
import { BsThreeDotsVertical, BsPencil, BsReply } from "react-icons/bs";
import constants from "../../constants";
const LeftMessage = ({
  showMessageMenuForMessageId,
  setShowMessageMenuForMessageId,
  message,
  onAction,
}) => {
  return (
    <div
      className="self-start mb-4 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl"
      id={`message_${message.message_id}`}
    >
      {showMessageMenuForMessageId === message.message_id && (
        <div
          className={`flex items-center justify-end pb-1 ${
            !!message.isEdited ? "mr-8" : ""
          }`}
        >
          <div
            className="p-2 bg-gray-500 text-gray-50 mr-1 rounded-full cursor-pointer hover:bg-gray-600"
            onClick={() => {
              onAction({
                message: message.text,
                type: constants.actionTypes.REPLY,
                id: message.message_id,
              });
              setShowMessageMenuForMessageId(null);
            }}
          >
            <BsReply />
          </div>
        </div>
      )}

      <div className="flex">
        <div className="bg-blue-200 px-2 lg:px-4 py-1 lg:py-2 rounded-r-lg rounded-bl-lg overflow-hidden flex flex-col message">
          {!!message.replyOf && (
            <a
              className="text-gray-700 pt-1 pb-3 mb-1 border-b-2 border-gray-500 w-full truncate"
              href={`#message_${message.replyOf}`}
            >
              <span className="text-lg mb-0.5  font-bold border-l-4 border-gray-700 px-3 py-1">
                {message.replyText}
              </span>
            </a>
          )}
          <div className="flex">
            <div className="flex-grow flex flex-col w-5/6">
              <span className="text-lg mb-0.5 truncate ">{message.text}</span>
              <span className="text-xs text-gray-500 flex justify-between items-center">
                <span>{moment(message.created_at).format("hh:MM A")}</span>
              </span>
            </div>
            <div className={`flex-none  flex flex-col items-between ml-3 py-1`}>
              <div className="flex-grow">
                <BsThreeDotsVertical
                  className="text-gray-900 text-xm cursor-pointer messageMenu block lg:hidden"
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

export default LeftMessage;

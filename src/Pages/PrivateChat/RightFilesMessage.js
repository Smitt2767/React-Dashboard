import React, { useState } from "react";
import { BsCheckAll, BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import { AiOutlineFilePdf, AiOutlineFile, AiOutlinePlus } from "react-icons/ai";
import constants from "../../constants";
import { useSelector } from "react-redux";
import FilesPreviewAndDownload from "../../Components/Modal/FilesPreviewAndDownload";

const RightFilesMessage = ({
  message,
  isLast,
  showMessageMenuForMessageId,
  setShowMessageMenuForMessageId,
  deleteMessage,
}) => {
  const files = JSON.parse(message.files);
  const showFiles = files.slice(0, 4);
  const showNumber = files.slice(4, files.length).length;
  const { currentUser, rightPanel } = useSelector((state) => state.privateChat);
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && (
        <FilesPreviewAndDownload files={files} setShowModal={setShowModal} />
      )}
      <div
        className="self-end mb-4 overflow-hidden"
        id={`message_${message.message_id}`}
      >
        {showMessageMenuForMessageId === message.message_id && (
          <div className="flex items-center justify-end pb-1">
            <div
              className="p-2 bg-red-500 text-gray-50 rounded-full cursor-pointer hover:bg-red-600"
              onClick={() => {
                deleteMessage(
                  message.message_id,
                  currentUser.user_id,
                  isLast,
                  rightPanel.messages[1].text
                );
                setShowMessageMenuForMessageId(null);
              }}
            >
              <BsTrash />
            </div>
          </div>
        )}
        <div className="flex flex-row-reverse ">
          <div className="ml-auto bg-gray-300  px-2 lg:px-4 py-1 lg:py-2 rounded-l-lg rounded-br-lg overflow-hidden z-10 message flex-col flex">
            <div className="flex ">
              <div
                className={`grid cursor-pointer ${
                  showFiles.length === 1 ? "grid-cols-1" : "grid-cols-2"
                } gap-1`}
                onClick={() => setShowModal(true)}
              >
                {showFiles.map((file, i) => {
                  return (
                    <div
                      key={file.file_id}
                      className="h-48 w-40  rounded-lg overflow-hidden relative shadow-lg"
                    >
                      {file.type.startsWith("image/") ? (
                        <div
                          className="w-full h-full"
                          style={{
                            background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0) ), url("${constants.API_URL}/${file.path}") center/cover`,
                          }}
                        ></div>
                      ) : (
                        <div className="h-48 w-40  rounded-lg overflow-hidden relative shadow-lg flex flex-col justify-center items-center p-1 bg-gray-700">
                          <div className="mb-3 text-4xl">
                            {file.type === "application/pdf" ? (
                              <AiOutlineFilePdf />
                            ) : (
                              <AiOutlineFile />
                            )}
                          </div>
                          <p className="text-center text-xs text-gray-50 px-4">
                            {file.name}
                          </p>
                        </div>
                      )}
                      {showNumber && i === showFiles.length - 1 && (
                        <div className="absolute w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="text-gray-300 hover:text-gray-50 flex items-center">
                            <AiOutlinePlus className="text-4xl mr-1" />
                            <span className="text-4xl"> {showNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
                <BsCheckAll className="flex-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightFilesMessage;

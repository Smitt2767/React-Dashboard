import React, { useState } from "react";
import { AiOutlineFilePdf, AiOutlineFile, AiOutlinePlus } from "react-icons/ai";
import constants from "../../constants";
import FilesPreviewAndDownload from "../../Components/Modal/FilesPreviewAndDownload";
import moment from "moment";
const LeftFileMessage = ({ message }) => {
  const [showModal, setShowModal] = useState(false);
  const files = JSON.parse(message.files);
  const showFiles = files.slice(0, 4);
  const showNumber = files.slice(4, files.length).length;
  return (
    <>
      {showModal && (
        <FilesPreviewAndDownload files={files} setShowModal={setShowModal} />
      )}
      <div
        className="self-start mb-4 overflow-hidden"
        id={`message_${message.message_id}`}
      >
        <div className="flex flex-row-reverse ">
          <div className="bg-blue-200 px-2 lg:px-4 py-1 lg:py-2 rounded-r-lg rounded-bl-lg overflow-hidden flex flex-col message">
            <div className="flex">
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
            </div>
            <div className="mt-2 px-1">
              <span className="text-xs text-gray-500 flex justify-between items-center">
                <span>{moment(message.created_at).format("hh:mm A")}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftFileMessage;

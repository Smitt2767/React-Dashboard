import React, { useState } from "react";
import { BsDownload } from "react-icons/bs";
import {
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineFilePdf,
  AiOutlineFile,
} from "react-icons/ai";
import FileDownload from "js-file-download";
import constants from "../../constants";
import axios from "axios";
const FilesPreviewAndDownload = ({ files, setShowModal }) => {
  const [fileIndex, setFileIndex] = useState(0);
  const filesLength = files.length;
  const hasPrev = files[fileIndex].file_id !== files[0].file_id;
  const hasNext = files[fileIndex].file_id !== files[filesLength - 1].file_id;

  const hadleDownload = async (e) => {
    try {
      const res = await axios({
        url: `${constants.API_URL}/${files[fileIndex].path}`,
        method: "GET",
        responseType: "blob",
      });
      if (res.status) {
        FileDownload(res.data, files[fileIndex].name);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none close"
        onClick={(e) => {
          if (e.target.classList.contains("close")) {
          }
        }}
      >
        <div className=" flex relative w-full h-full">
          <div className="flex-none flex items-center justify-end px-10 py-8 text-4xl text-gray-50 absolute right-0 top-0">
            <button className="mr-8 cursor-pointer" onClick={hadleDownload}>
              <BsDownload />
            </button>
            <button onClick={() => setShowModal(false)}>
              <AiOutlineClose />
            </button>
          </div>
          <div className="w-full absolute bottom-0 flex items-center justify-center py-4">
            {files.map((file) => {
              return (
                <div
                  className={`${
                    file.file_id === files[fileIndex].file_id
                      ? "h-8 w-8 bg-gray-400"
                      : "h-4 w-4 bg-gray-600"
                  }  rounded-full mx-1`}
                ></div>
              );
            })}
          </div>
          <div className="flex-none flex items-center justify-center px-4">
            <button
              className="bg-gray-600 hover:bg-gray-700 text-gray-50 p-4 text-4xl rounded-full disabled:bg-gray-900"
              disabled={!hasPrev}
              onClick={() => setFileIndex(fileIndex - 1)}
            >
              <AiOutlineLeft />
            </button>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center">
            {files[fileIndex].type.startsWith("image/") ? (
              <img
                src={`${constants.API_URL}/${files[fileIndex].path}`}
                style={{
                  maxHeight: "70%",
                }}
                className=""
                alt={files[fileIndex].name}
              />
            ) : (
              <div className="text-gray-300 flex flex-grow flex-col items-center justify-center">
                {files[fileIndex].type === "application/pdf" ? (
                  <AiOutlineFilePdf className="text-8xl" />
                ) : (
                  <AiOutlineFile className="text-8xl" />
                )}
                <div className="text-gray-50 text-center mt-4">
                  {files[fileIndex].name}
                </div>
              </div>
            )}
          </div>
          <div className="flex-none flex items-center justify-center px-4">
            <button
              className="bg-gray-600 hover:bg-gray-700 text-gray-50 p-4 text-4xl rounded-full disabled:bg-gray-900"
              disabled={!hasNext}
              onClick={() => setFileIndex(fileIndex + 1)}
            >
              <AiOutlineRight />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-opacity-70 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default FilesPreviewAndDownload;

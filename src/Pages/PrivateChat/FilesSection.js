import React from "react";
import { AiOutlineFilePdf, AiOutlineFile, AiOutlinePlus } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";

const FilesSection = ({ files, setFiles, galleryRef }) => {
  return (
    <div
      className="absolute w-full h-52 -top-56 overflow-auto bg-gray-50 shadow-lg rounded-lg p-2"
      style={{ width: "98%" }}
    >
      <div className="w-full h-full overflow-auto flex flex-wrap scrollRightPanel">
        {files.map((file) => {
          return (
            <React.Fragment key={file.id}>
              {file.preview && file.type.startsWith("image/") ? (
                <div
                  className="h-48 w-40 m-1 rounded-lg overflow-hidden relative shadow-lg"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0) ), url(${file.preview}) center/cover`,
                  }}
                >
                  <span
                    className="absolute bg-gray-50 h-6 w-6 rounded-full flex justify-center items-center right-2 top-2 cursor-pointer text-gray-700"
                    onClick={() => {
                      setFiles([
                        ...files.filter((item) => item.id !== file.id),
                      ]);
                    }}
                  >
                    <AiOutlineClose />
                  </span>
                </div>
              ) : (
                <div className="h-48 w-40 m-1 rounded-lg overflow-hidden relative shadow-lg flex flex-col justify-center items-center p-1 bg-gray-700">
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
                  <span
                    className="absolute bg-gray-50 h-6 w-6 rounded-full flex justify-center items-center right-2 top-2 cursor-pointer text-gray-700"
                    onClick={() => {
                      setFiles([
                        ...files.filter((item) => item.id !== file.id),
                      ]);
                    }}
                  >
                    <AiOutlineClose />
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
        <div className="h-48 w-20 rounded-lg bg-gray-700 flex items-center justify-center m-1">
          <span
            className="bg-gray-50 h-12 w-12 rounded-full flex justify-center items-center  cursor-pointer text-gray-700 text-4xl"
            onClick={() => {
              if (galleryRef && galleryRef.current) {
                galleryRef.current.click();
              }
            }}
          >
            <AiOutlinePlus />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilesSection;

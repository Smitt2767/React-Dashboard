import React, { useState } from "react";

const Form = ({ handleSubmit, setShowModal }) => {
  const [username, setUsername] = useState("");
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none close"
        onClick={(e) => {
          if (e.target.classList.contains("close")) {
          }
        }}
      >
        <div className={`relative w-auto my-6 mx-auto max-w-3xl px-8 md:px-0 `}>
          {/*content*/}
          <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-gray-100 outline-none focus:outline-none px-12 py-8">
            {/*body*/}
            <div className="flex flex-col items-center w-96 ">
              <h1 className="text-4xl text-gray-700 mb-8">Username</h1>
              <input
                className="w-full focus:outline-none bg-transparent border-b-2 border-gray-700 p-2 mb-8"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.keyCode === 13) {
                    handleSubmit(username);
                    setShowModal(false);
                  }
                }}
              />
              <button
                className="bg-blue-600 text-gray-50 px-12 py-2 shadow-lg rounded-lg text-xl hover:bg-blue-800"
                onClick={() => {
                  handleSubmit(username);
                  setShowModal(false);
                }}
              >
                Submit
              </button>
            </div>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Form;

import React from "react";

const Alert = ({ setShowModal, handleYesBtnClicked }) => {
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none close"
        onClick={(e) => {
          if (e.target.classList.contains("close")) {
            setShowModal(false);
          }
        }}
      >
        <div className={`relative w-auto my-6 mx-auto max-w-3xl px-8 md:px-0 `}>
          {/*content*/}
          <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-gray-100  outline-none focus:outline-none">
            {/*body*/}
            <div className="py-8 px-16 flex flex-col justify-center items-center">
              <h1 className="font-bold text-gray-800 mb-2 text-3xl mb-4">
                Are You Sure ?
              </h1>
              <div className="flex justify-center items-center">
                <button
                  className="text-sm md:text-lg bg-blue-600 text-gray-50 px-8 py-1 rounded-md mx-2 focus:outline-none hover:bg-blue-800"
                  onClick={() => {
                    handleYesBtnClicked();
                    setShowModal(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="text-sm md:text-lg bg-red-600 text-gray-50 px-8 py-1 rounded-md hover:text-pink mx-2 focus:outline-none hover:bg-red-800"
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
              </div>
            </div>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Alert;

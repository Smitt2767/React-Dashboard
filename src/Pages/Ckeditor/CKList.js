import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, deleteData, setShowModal } from "./store/ckSlice";
import { BsPencil, BsTrash } from "react-icons/bs";
import Alert from "../../Components/Modal/Alert";

const CKList = (props) => {
  const { ckTableData, showModal } = useSelector((state) => state.ck);
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  const innerTable = (data) => {
    return (
      <ul className="ck-content flex flex-col justify-center ">
        {data.map((ckData) => {
          return (
            <li
              key={ckData.id}
              dangerouslySetInnerHTML={{ __html: ckData.data }}
            ></li>
          );
        })}
      </ul>
    );
  };

  const handleButtonClick = (data) => {
    dispatch(setShowModal(data));
  };

  const handleYesBtnClicked = () => {
    if (id) {
      dispatch(deleteData({ id }));
    }
  };

  return (
    <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-y-auto">
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-8">
        CKEditor List
      </h1>
      {showModal && id && (
        <Alert
          setShowModal={handleButtonClick}
          handleYesBtnClicked={handleYesBtnClicked}
        />
      )}
      <div className="relative h-screen overflow-y-auto">
        <table className="w-full ">
          <thead className="bg-gray-700 text-gray-50 sticky top-0">
            <tr className="">
              <th className="text-2xl w-16 py-2 text-center">Id</th>
              <th className="text-2xl py-2 text-center">Data</th>
              <th className="text-2xl w-32 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!ckTableData.length ? (
              <tr className="border-b-2 border-l-2 border-r-2 border-gray-300">
                <td
                  className="bg-gray-100 text-center py-3 text-2xl"
                  colSpan="3"
                >
                  No Rcords Found
                </td>
              </tr>
            ) : (
              ckTableData.map((ck) => {
                return (
                  <tr key={ck.id} className="">
                    <td className="bg-gray-100 text-center py-1 text-2xl">
                      {ck.id}
                    </td>
                    <td className="bg-gray-100 pl-4 lg:pl-8 py-1 text-xl">
                      {innerTable(ck.data)}
                    </td>
                    <td className="bg-gray-100 text-center py-1  ">
                      <button
                        className="bg-blue-500 rounded-full p-3 mr-4 hover:bg-blue-700 shadow-lg"
                        onClick={() => {
                          props.history.push(`/ckeditor/${ck.id}`);
                        }}
                      >
                        <BsPencil className="text-2xl text-gray-50 " />
                      </button>
                      <button
                        className="bg-red-500 rounded-full p-3 hover:bg-red-700 shadow-lg"
                        onClick={() => {
                          setId(ck.id);
                          dispatch(setShowModal(true));
                        }}
                      >
                        <BsTrash className="text-2xl text-gray-50" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            <tr className="sticky bottom-0">
              <td
                colSpan="3"
                className="bg-gray-700 text-center py-1 text-2xl text-gray-50"
              >
                Table Footer
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CKList;

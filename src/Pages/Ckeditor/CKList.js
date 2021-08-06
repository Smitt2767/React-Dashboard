import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  deleteData,
  setShowModal,
  setPage,
  clearTableRelatedData,
} from "./store/ckSlice";
import Alert from "../../Components/Modal/Alert";
import { BsPencil, BsTrash } from "react-icons/bs";
import CustomTable from "../../Components/CustomTable";

const CKList = ({ history }) => {
  const { ckTableData, showModal, page, limit, hasMore, totalRecords } =
    useSelector((state) => state.ck);
  const dispatch = useDispatch();
  const [id, setId] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: (originalRow, rowIndex) => {
          return (
            <div className="flex h-full justify-center items-center ">
              <h1 className="text-xl font-bold">{originalRow.ck_id}</h1>
            </div>
          );
        },
        width: 40,
      },
      {
        Header: "Data",
        accessor: (originalRow, rowIndex) => {
          return (
            <ul className="ck-content flex flex-col justify-center ">
              {originalRow.data.map((ckData) => {
                return (
                  <li
                    key={ckData.id}
                    dangerouslySetInnerHTML={{ __html: ckData.data }}
                  ></li>
                );
              })}
            </ul>
          );
        },
      },
      {
        Header: "Actions",
        accessor: (originalRow, rowIndex) => {
          return (
            <div className="flex h-full justify-center items-center">
              <button
                className="bg-blue-500 rounded-full p-2 lg:p-3 mr-4 hover:bg-blue-700 shadow-lg"
                onClick={() => {
                  history.push(`/ckeditor/${originalRow.ck_id}`);
                }}
              >
                <BsPencil className="text-lg lg:text-2xl text-gray-50 " />
              </button>
              <button
                className="bg-red-500 rounded-full p-2 lg:p-3  hover:bg-red-700 shadow-lg"
                onClick={() => {
                  setId(originalRow.ck_id);
                  dispatch(setShowModal(true));
                }}
              >
                <BsTrash className="text-lg lg:text-2xl text-gray-50" />
              </button>
            </div>
          );
        },
        Footer: `Total Records - ${totalRecords}`,
        width: 100,
      },
    ],
    [totalRecords, dispatch, history]
  );

  useEffect(() => {
    return () => {
      dispatch(clearTableRelatedData());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getData({ page, limit }));
  }, [dispatch, page, limit]);

  const next = () => {
    dispatch(setPage(page + 1));
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
    <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-8">
        CKEditor List
      </h1>

      {showModal && id && (
        <Alert
          setShowModal={handleButtonClick}
          handleYesBtnClicked={handleYesBtnClicked}
        />
      )}

      <CustomTable
        columns={columns}
        data={ckTableData}
        hasMore={hasMore}
        setId={setId}
        dispatch={dispatch}
        setShowModal={setShowModal}
        next={next}
      />
    </div>
  );
};

export default CKList;

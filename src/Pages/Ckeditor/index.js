import React, { useEffect } from "react";
import CkEditor from "./Ckeditor";
import { useSelector, useDispatch } from "react-redux";
import { BsTrash, BsPlus } from "react-icons/bs";
import {
  addInstance,
  deleteInstance,
  sendData,
  getDataById,
  editData,
  clear,
  setEditMode,
} from "./store/ckSlice";

const Ckeditor = (props) => {
  const { ckInstances, editMode } = useSelector((state) => state.ck);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.match.params.id) {
      const id = props.match.params.id * 1;
      if (id) {
        dispatch(getDataById(id));
        dispatch(setEditMode(true));
      }
    }
  }, [dispatch, props.match.params.id]);

  return (
    <div className="w-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-y-auto">
      <div className="flex justify-between items-center mb-8 w-full">
        <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer">
          CKEditor
        </h1>
        <button
          className="rounded-full bg-blue-500 text-gray-50 p-3 cursor-pointer hover:bg-blue-600 shadow-xl"
          onClick={() => {
            dispatch(addInstance());
          }}
        >
          <BsPlus className="text-3xl" />
        </button>
      </div>

      <div className="w-full flex flex-col">
        {ckInstances.map((ck) => {
          return (
            <div className="flex items-center py-3" key={ck.id}>
              <CkEditor ck={ck} />
              {ckInstances.length > 1 && (
                <button
                  className="ml-4 rounded-full bg-red-500 text-gray-50 p-3 cursor-pointer hover:bg-red-600 shadow-xl"
                  onClick={() => {
                    dispatch(deleteInstance(ck.id));
                  }}
                >
                  <BsTrash className="text-2xl" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="w-full mt-8 flex items-center">
        {!editMode ? (
          <button
            className="bg-green-600 text-gray-50 px-10 py-2 font-bold text-xl shadow-lg hover:bg-green-800 rounded-lg disabled:bg-gray-400"
            onClick={() => {
              dispatch(sendData(ckInstances));
            }}
            disabled={ckInstances.some((ck) => ck.data === "")}
          >
            Submit
          </button>
        ) : (
          <button
            className="bg-green-600 text-gray-50 px-10 py-2 font-bold text-xl shadow-lg hover:bg-green-800 rounded-lg disabled:bg-gray-400"
            onClick={() => {
              dispatch(
                editData({ data: ckInstances, id: props.match.params.id })
              );
              dispatch(setEditMode(false));
            }}
            disabled={ckInstances.some((ck) => ck.data === "")}
          >
            Save
          </button>
        )}
        {!editMode ? (
          <button
            className="text-gray-50 px-10 py-2 font-bold text-xl shadow-lg hover:bg-blue-800 rounded-lg bg-blue-600 ml-8 disabled:bg-gray-400"
            disabled={ckInstances.every((ck) => ck.data === "")}
            onClick={() => {
              dispatch(clear());
            }}
          >
            Clear
          </button>
        ) : (
          <button
            className="text-gray-50 px-10 py-2 font-bold text-xl shadow-lg hover:bg-blue-800 rounded-lg bg-blue-600 ml-8"
            onClick={() => {
              dispatch(clear());
              dispatch(setEditMode(false));
              props.history.goBack();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Ckeditor;

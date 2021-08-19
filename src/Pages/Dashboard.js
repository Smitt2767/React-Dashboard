import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import API from "../services/api";
import constants from "../constants";
import { setSuccessMessage, setErrorMessage } from "../store/dashboardSlice";
import { useDispatch } from "react-redux";
import Form from "../Components/formik/Form";
import { setLocalStorage } from "../services/jwtService";

const Dashboard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [initialState, setInitialState] = useState({});
  const dispatch = useDispatch();
  const [hasValues, setHasValues] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/users/profile");
        const {
          username,
          email,
          mobile_number,
          gender,
          address,
          address2,
          city,
          state,
          zipcode,
          avatar,
        } = res.data.data;
        if (res.status) {
          setInitialState({
            username,
            email,
            mobile_number,
            gender,
            address,
            address2,
            city,
            state,
            zipcode,
            avatar: `${constants.API_URL}/${avatar}`,
          });
          setAvatar(`${constants.API_URL}/${avatar}`);
          setHasValues(true);
        }
      } catch (err) {
        dispatch(setErrorMessage(err.response?.data.message));
      }
    })();
  }, [dispatch]);

  const onDrop = useCallback((acceptedFile) => {
    setProfileImage(acceptedFile[0]);
    setAvatar(URL.createObjectURL(acceptedFile[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*",
  });

  const updateProfilePicture = async () => {
    if (!avatar || !profileImage) return;
    try {
      const formData = new FormData();
      formData.append("avatar", profileImage);
      const res = await API.put("/users/profileImage", formData);
      if (res.status) {
        setInitialState({
          ...initialState,
          avatar: `${constants.API_URL}/${res.data.data}`,
        });
        setAvatar(`${constants.API_URL}/${res.data.data}`);
        dispatch(setSuccessMessage(res.data.message));
        console.log("hi");
        const userData = JSON.parse(localStorage.getItem("user"));

        const newUserData = {
          ...userData,
          avatar: res.data.data,
        };
        setLocalStorage("user", newUserData);
      }
    } catch (err) {
      dispatch(setErrorMessage(err.response?.data.message));
    }
  };

  return (
    <div className="w-full h-full ">
      <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
        <div className="h-full w-full overflow-y-auto flex flex-col md:flex-row border border-gray-200 rounded-lg">
          <div className=" flex-none p-4 md:p-8 border-r border-gray-200">
            <div className="flex flex-col items-center">
              <div
                {...getRootProps()}
                className="w-72 h-72 rounded-lg shadow-xl cursor-pointer overflow-hidden "
              >
                <input {...getInputProps()} />
                {!!avatar && (
                  <img
                    src={avatar}
                    alt="profile"
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </div>

              <button
                className="mt-4 bg-blue-500 shadow-lg px-8 py-2 text-lg font-bold text-gray-200 hover:bg-blue-700 hover:text-gray-50 rounded-full disabled:bg-gray-400"
                disabled={initialState.avatar === avatar}
                onClick={updateProfilePicture}
              >
                Update Profile Picture
              </button>
            </div>
          </div>
          <div className="flex-grow h-full p-4 md:p-8">
            <div className="shadow-xl rounded-lg h-full w-full bg-gray-50 p-8 flex flex-col items-center">
              <h1 className="pb-4 mb-6 text-4xl font-bold text-gray-400 capitalize w-full text-center border-b border-gray-300">
                Hello, {initialState.username}
              </h1>
              {hasValues && (
                <Form
                  initialState={initialState}
                  setInitialState={setInitialState}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

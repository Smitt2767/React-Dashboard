import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { GithubPicker } from "react-color";
import constants from "../constants";
import { setSuccessMessage, setErrorMessage } from "../store/dashboardSlice";
import { useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
const colors = [
  "#000000",
  "#333333",
  "#B80000",
  "#DB3E00",
  "#FCCB00",
  "#008B02",
  "#006B76",
  "#1273DE",
  "#004DCF",
  "#5300EB",
  "#EB9694",
  "#FAD0C3",
  "#FEF3BD",
];

const Signature = () => {
  const sigCanRef = useRef();
  const [trimmedDataUrl, setTrimmedDataUrl] = useState(null);
  const [errorMessage, setErrMessage] = useState(null);
  const [successMessage, setSucMessage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const dispatch = useDispatch();

  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    if (successMessage) {
      dispatch(setSuccessMessage(successMessage));
      setSucMessage("");
    }
    if (errorMessage) {
      dispatch(setErrorMessage(errorMessage));
      setSucMessage("");
    }
  }, [errorMessage, successMessage, dispatch]);

  const clear = () => {
    sigCanRef.current.clear();
    setTrimmedDataUrl(null);
  };

  const trim = () => {
    if (sigCanRef.current.isEmpty()) {
      setErrMessage("Draw your signature first...");
      return;
    }
    setTrimmedDataUrl(
      sigCanRef.current.getTrimmedCanvas().toDataURL("image/png")
    );
  };

  const upload = async (createNew = true) => {
    if (!trimmedDataUrl) return;

    try {
      let res;
      if (createNew) {
        res = await axios.post(`${constants.API_URL}/signature`, {
          signature: trimmedDataUrl,
        });
      } else {
        res = await axios.post(`${constants.API_URL}/signature/existing`, {
          signature: trimmedDataUrl,
        });
      }

      if (res.data.success) {
        setSucMessage(res.data.message);
        setFileName(res.data.fileName);
        clear();
      }
    } catch (e) {
      console.dir(e);
      setErrMessage(e.response.data.message || e.response.statusText);
    }
  };

  const handleChange = (color) => {
    setColor(color.hex);
  };
  return (
    <div className="w-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-y-auto">
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-8">
        Signature PDF
      </h1>
      <div className="w-full flex flex-col items-center">
        <SignatureCanvas
          ref={sigCanRef}
          penColor={color}
          canvasProps={{
            className: "shadow-2xl max-w-lg w-full h-60 rounded-lg",
          }}
          minWidth={1.5}
          maxWidth={4}
          dotSize={5}
        />
        <GithubPicker
          color={color}
          colors={colors}
          className=""
          onChangeComplete={handleChange}
        />
        {fileName && (
          <div className="bg-gray-700 text-gray-50 p-2 mt-4 rounded-full flex items-center justify-between">
            <a
              href={`${constants.API_URL}/${fileName}`}
              target="_blank"
              rel="noreferrer"
            >
              {fileName}
            </a>
            <AiOutlineClose
              className="bg-gray-50 rounded-full p-1 ml-12 text-2xl text-gray-700 cursor-pointer"
              onClick={() => {
                setFileName(null);
              }}
            />
          </div>
        )}
        <div className="flex mt-8 px-12">
          <button
            className="bg-blue-600 text-gray-50 px-10 py-1 font-bold text-xl shadow-lg hover:bg-blue-800 rounded-lg mx-4"
            onClick={clear}
          >
            Clear
          </button>

          <button
            className="bg-green-600 text-gray-50 px-10 py-1 font-bold text-xl shadow-lg hover:bg-green-800 rounded-lg mx-4"
            onClick={trim}
          >
            Trim
          </button>
        </div>
        {trimmedDataUrl && (
          <div className="flex flex-col my-8 items-center">
            <img src={trimmedDataUrl} alt="signature img" className="h-28" />
            <div className="flex mt-8 px-12">
              <button
                className="bg-blue-600 text-gray-50 px-10 py-1 font-bold text-xl shadow-lg hover:bg-blue-800 rounded-lg mx-4"
                onClick={upload}
              >
                New
              </button>

              <button
                className="bg-green-600 text-gray-50 px-10 py-1 font-bold text-xl shadow-lg hover:bg-green-800 rounded-lg mx-4"
                onClick={() => upload(false)}
              >
                Existing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signature;

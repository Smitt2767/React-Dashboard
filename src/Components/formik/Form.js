import React from "react";
import { useFormik } from "formik";
import TextInput from "./TextInput";
import GooglePlacesAutoComplete from "./GooglePlacesAutoComplete";
import API from "../../services/api";
import { useDispatch } from "react-redux";
import { setSuccessMessage, setErrorMessage } from "../../store/dashboardSlice";

const Form = ({ initialState, setInitialState }) => {
  const dispatch = useDispatch();

  const validate = (values) => {
    const errors = {};

    // Username
    if (!values.username.trim()) errors.username = "username must be required";

    // Email
    if (!values.email) errors.email = "email must be required";
    else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        values.email
      )
    )
      errors.email = "invalid email";

    // Mobile_number
    if (!values.mobile_number)
      errors.mobile_number = "mobile number must be required";
    else if (!RegExp(/^\d+$/).test(values.mobile_number))
      errors.mobile_number = "please enter only digits";
    else if (values.mobile_number.length !== 10)
      errors.mobile_number = "invalid mobile number";

    // Address
    if (!values.address) errors.address = "address must be required";

    // Address2
    if (!values.address2) errors.address2 = "address2 must be required";

    // City
    if (!values.city) errors.city = "city must be required";

    // State
    if (!values.state) errors.state = "state must be required";

    // zipcode
    if (!values.zipcode) errors.zipcode = "zip code must be required";
    else if (!RegExp(/^\d+$/).test(values.zipcode))
      errors.zipcode = "please enter only digits";

    return errors;
  };

  const onSubmit = async (values) => {
    try {
      const res = await API.put("/users/profile", values);
      if (res.status) {
        formik.resetForm({ values: { ...values } });
        setInitialState({ ...values });
        dispatch(setSuccessMessage(res.data.message));
      }
    } catch (err) {
      console.log(err);
      dispatch(setErrorMessage(err.response?.data.message));
    }
  };

  const formik = useFormik({
    initialValues: { ...initialState },
    validate,
    onSubmit,
  });

  return (
    <form
      className="flex flex-col h-full w-full overflow-y-auto"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
      id="profileForm"
    >
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-0 lg:mb-3">
          <TextInput
            lableName="Username"
            type="text"
            required={true}
            placeholder="Enter username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username || ""}
            name="username"
            errorMessage={
              formik.errors.username && formik.touched.username
                ? formik.errors.username
                : ""
            }
          />
          <TextInput
            lableName="Email"
            type="email"
            required={true}
            placeholder="Enter email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email || ""}
            name="email"
            errorMessage={
              formik.errors.email && formik.touched.email
                ? formik.errors.email
                : ""
            }
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-0 lg:mb-3">
          <TextInput
            lableName="Mobile Number"
            type="text"
            required={true}
            placeholder="Enter mobile number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mobile_number || ""}
            name="mobile_number"
            errorMessage={
              formik.errors.mobile_number && formik.touched.mobile_number
                ? formik.errors.mobile_number
                : ""
            }
          />
          <div className="flex flex-col lg:mr-4 md:mr-2 mr-0 w-full mb-2 lg:mb-0">
            <label className="text-sm lg:text-lg font-bold text-gray-700 mb-1">
              Gender
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center">
              <div className="flex items-center">
                <input
                  type="radio"
                  className=""
                  name="gender"
                  onChange={formik.handleChange}
                  value="male"
                  checked={formik.values.gender === "male"}
                />
                <span className="ml-2 font-bold text-gray-700">Male</span>
              </div>
              <div className="flex items-center ml-4">
                <input
                  type="radio"
                  className=""
                  name="gender"
                  onChange={formik.handleChange}
                  value="female"
                  checked={formik.values.gender === "female"}
                />
                <span className="ml-2 font-bold text-gray-700">Female</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-0 lg:mb-3">
          <GooglePlacesAutoComplete
            formik={formik}
            lableName="Address"
            required={true}
            errorMessage={
              formik.errors.address && formik.touched.address
                ? formik.errors.address
                : ""
            }
          />
          <TextInput
            lableName="address2"
            type="text"
            required={true}
            placeholder="Enter address2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address2 || ""}
            name="address2"
            errorMessage={
              formik.errors.address2 && formik.touched.address2
                ? formik.errors.address2
                : ""
            }
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-0 lg:mb-3">
          <TextInput
            lableName="City"
            type="text"
            required={true}
            placeholder="Enter city"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city || ""}
            name="city"
            errorMessage={
              formik.errors.city && formik.touched.city
                ? formik.errors.city
                : ""
            }
          />
          <TextInput
            lableName="State"
            type="text"
            required={true}
            placeholder="Enter state"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.state || ""}
            name="state"
            errorMessage={
              formik.errors.state && formik.touched.state
                ? formik.errors.state
                : ""
            }
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-0 lg:mb-3">
          <TextInput
            lableName="Zip Code"
            type="text"
            required={true}
            placeholder="Enter zipcode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.zipcode || ""}
            name="zipcode"
            errorMessage={
              formik.errors.zipcode && formik.touched.zipcode
                ? formik.errors.zipcode
                : ""
            }
          />
        </div>
      </div>
      <div className="flex-none w-full flex  items-center">
        <button
          type="submit"
          form="profileForm"
          disabled={!formik.isValid || !formik.dirty}
          className="bg-blue-500 shadow-lg px-10 py-2 text-lg font-bold text-gray-200 hover:bg-blue-700 hover:text-gray-50 rounded-full disabled:bg-gray-400 mt-4 w-full md:w-auto"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;

import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useFormik } from "formik";
import CreditCardInputWrapper from "../../Components/CreditCardInputWrapper";
import {
  FaUser,
  FaRegCalendarAlt,
  FaLock,
  FaDollarSign,
  FaCreditCard,
} from "react-icons/fa";
import { AiOutlineExport } from "react-icons/ai";
import { BsCreditCard } from "react-icons/bs";
import queryString from "query-string";
import api from "../../services/api";
import { setSuccessMessage, setErrorMessage } from "../../store/dashboardSlice";
import { useDispatch } from "react-redux";
import Loader from "../../Components/Loader";

const CreditcardForm = ({ location, match, history }) => {
  const popup =
    queryString.parse(location.search)?.popup === "true" ? true : false;

  const [loading, setLoading] = useState(false);

  const initialValues = {
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    balance: "",
  };

  const [isDirty, setIsDirty] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      localStorage.removeItem("creditCardFormData");
    };
  }, []);

  useEffect(() => {
    if (popup) {
      const creditCardFormData = JSON.parse(
        localStorage.getItem("creditCardFormData")
      );
      if (!!creditCardFormData) {
        Object.keys(initialValues).forEach((key) => {
          initialValues[key] = creditCardFormData[key];
        });
      }
      setEditMode(creditCardFormData.editMode);
    }
  }, [popup]);

  useEffect(() => {
    if (match.params.id && !popup) {
      const id = match.params.id * 1;
      if (id) {
        (async () => {
          try {
            const res = await api.get(`/cc/${id}`);
            if (res.status) {
              const data = res.data.data;
              initialValues.cardHolderName = data.card_holder_name;
              initialValues.cardNumber = data.card_number;
              initialValues.cvv = data.cvv;
              initialValues.balance = data.balance.toString();
              const expiryDate = `${data.expiry_month.toString()}${data.expiry_year.toString()}`;
              initialValues.expiryDate =
                expiryDate.length === 5 ? `0${expiryDate}` : expiryDate;

              formik.resetForm({ values: initialValues });
              localStorage.removeItem("creditCardFormData");
              localStorage.setItem(
                "creditCardFormData",
                JSON.stringify({
                  ...initialValues,
                  editMode: true,
                })
              );
            }
          } catch (e) {
            if (e.response?.data) {
              dispatch(setErrorMessage(e.response?.data.message));
              setLoading(false);
            }
          }
        })();
        setEditMode(true);
      }
    }

    return () => {
      clear();
    };
  }, [match.params.id, popup, dispatch]);

  const validate = (values) => {
    const errors = {};

    // card holder
    if (!values.cardHolderName.trim())
      errors.cardHolderName = "card holder name must be required";

    // card number
    if (!values.cardNumber) errors.cardNumber = "card number must be required";
    else if (values.cardNumber.length !== 16)
      errors.cardNumber = "invalid card number";

    // expiry date
    const month = values.expiryDate.slice(0, 2) * 1;
    const year = values.expiryDate.slice(2) * 1;

    if (!values.expiryDate)
      errors.expiryDate = "card expiry date must be required";
    else if (values.expiryDate.length !== 6)
      errors.expiryDate = "invalid expiry date";
    else if (month > 12 || month <= 0)
      errors.expiryDate = "invalid expiry date month";
    else if (year < new Date().getFullYear())
      errors.expiryDate = "card already expired";
    else if (
      year <= new Date().getFullYear() &&
      month < new Date().getMonth() + 1
    )
      errors.expiryDate = "card already expired";

    // CVV
    if (!values.cvv) errors.cvv = "card cvv must be required";
    else if (
      values.cvv.length < 3 ||
      values.cvv.length > 4 ||
      !RegExp(/^\d+$/).test(values.cvv)
    )
      errors.cvv = "invalid cvv";

    // Balance
    if (!values.balance) errors.balance = "balance must be required";

    return errors;
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      if (!editMode) {
        const res = await api.post("/cc", values);
        if (res.status) {
          dispatch(setSuccessMessage(res.data.message));
          setLoading(false);
        }
      } else {
        const res = await api.put(`/cc/${match.params.id}`, values);
        if (res.status) {
          dispatch(setSuccessMessage(res.data.message));
          setEditMode(false);
          history.push("/creditCardForm");
          setLoading(false);
        }
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
        setLoading(false);
      }
    }

    formik.resetForm({ values: initialValues });
    localStorage.removeItem("creditCardFormData");
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit,
  });

  useEffect(() => {
    if (isDirty)
      localStorage.setItem(
        "creditCardFormData",
        JSON.stringify({
          ...formik.values,
          editMode: editMode,
        })
      );
  }, [formik.values, isDirty, formik.isValid]);

  const handleChange = (label, value) => {
    if (!isDirty) {
      setIsDirty(true);
    }
    formik.setFieldValue(label, value);
  };

  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const clear = () => {
    formik.resetForm({
      values: {
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        balance: "",
      },
    });
    setEditMode(false);
  };

  return (
    <div className="w-full h-full ">
      <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
        <div className="mb-4 flex items-center w-full">
          <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer flex-grow">
            Credit Card Form
          </h1>
          {!!!popup && (
            <button
              className="flex-none text-2xl p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-gray-50 cursor-pointer"
              onClick={() => {
                window.open(
                  `${window.location.href}?popup=true`,
                  "_blank",
                  "width=900,height=900"
                );
              }}
            >
              <AiOutlineExport />
            </button>
          )}
        </div>

        <div className="h-full w-full overflow-y-auto">
          <div className="max-w-lg bg-gray-100 shadow-xl w-96 rounded-lg mt-10 relative mx-auto">
            <div className="absolute -top-12 w-full h-24 flex items-center justify-center">
              <div className="p-4 bg-blue-600 text-gray-200 rounded-full border-4 border-gray-50">
                <BsCreditCard className="text-4xl" />
              </div>
            </div>
            <div className="px-4 pt-12 pb-8 flex flex-col">
              <h1 className="text-2xl font-bold text-gray-700 self-center mb-8">
                Payment Gateway
              </h1>
              <form
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit(e);
                }}
                onReset={formik.handleReset}
                id="creditCardForm"
              >
                <CreditCardInputWrapper
                  Icon={FaUser}
                  label="Card holder"
                  errorMessage={
                    formik.errors.cardHolderName &&
                    formik.touched.cardHolderName
                      ? formik.errors.cardHolderName
                      : ""
                  }
                >
                  <input
                    type="text"
                    value={formik.values.cardHolderName}
                    name="cardHolderName"
                    onChange={(e) => {
                      handleChange(
                        "cardHolderName",
                        capitalizeFirstLetter(e.target.value)
                      );
                    }}
                    onBlur={formik.handleBlur}
                    className="w-full bg-transparent focus:outline-none text-md text-gray-600 font-bold"
                    placeholder="Card Holder Name"
                  />
                </CreditCardInputWrapper>
                <CreditCardInputWrapper
                  Icon={FaCreditCard}
                  label="Card Number"
                  errorMessage={
                    formik.errors.cardNumber && formik.touched.cardNumber
                      ? formik.errors.cardNumber
                      : ""
                  }
                >
                  <NumberFormat
                    value={formik.values.cardNumber}
                    format="#### #### #### ####"
                    name="cardNumber"
                    onValueChange={(values) => {
                      const { value } = values;
                      handleChange("cardNumber", value);
                    }}
                    placeholder="Card Number"
                    className="w-full bg-transparent focus:outline-none text-md text-gray-600 font-bold"
                    onBlur={formik.handleBlur}
                  />
                </CreditCardInputWrapper>
                <div className="w-full flex  justify-between">
                  <div className="mr-2">
                    <CreditCardInputWrapper
                      Icon={FaRegCalendarAlt}
                      label="Expiry Date"
                      errorMessage={
                        formik.errors.expiryDate && formik.touched.expiryDate
                          ? formik.errors.expiryDate
                          : ""
                      }
                    >
                      <NumberFormat
                        value={formik.values.expiryDate}
                        format="##/####"
                        mask={["M", "M", "Y", "Y", "Y", "Y"]}
                        name="expiryDate"
                        onValueChange={(values) => {
                          const { value } = values;
                          handleChange("expiryDate", value);
                        }}
                        placeholder="MM/YYYY"
                        className="w-full bg-transparent focus:outline-none text-md text-gray-600 font-bold"
                        onBlur={formik.handleBlur}
                      />
                    </CreditCardInputWrapper>
                  </div>
                  <div>
                    <CreditCardInputWrapper
                      Icon={FaLock}
                      label="CVV"
                      errorMessage={
                        formik.errors.cvv && formik.touched.cvv
                          ? formik.errors.cvv
                          : ""
                      }
                    >
                      <input
                        type="number"
                        value={formik.values.cvv}
                        name="cvv"
                        onChange={(e) => {
                          handleChange("cvv", e.target.value);
                        }}
                        placeholder="CVV"
                        className="w-full bg-transparent focus:outline-none text-md text-gray-600 font-bold"
                        onBlur={formik.handleBlur}
                      />
                    </CreditCardInputWrapper>
                  </div>
                </div>
                <CreditCardInputWrapper
                  Icon={FaDollarSign}
                  label="Balance"
                  errorMessage={
                    formik.errors.balance && formik.touched.balance
                      ? formik.errors.balance
                      : ""
                  }
                >
                  <NumberFormat
                    value={formik.values.balance}
                    thousandSeparator={true}
                    prefix={"$"}
                    name="balance"
                    onValueChange={(values) => {
                      const { value } = values;
                      handleChange("balance", value);
                    }}
                    placeholder="Balance"
                    className="w-full bg-transparent focus:outline-none text-md text-gray-600 font-bold"
                    onBlur={formik.handleBlur}
                  />
                </CreditCardInputWrapper>
                <div className="w-full flex justify-center mt-8">
                  <button
                    className="self-center bg-blue-600 hover:bg-blue-700 text-gray-50 px-8 py-2 rounded-lg font-bold shadow-lg disabled:bg-gray-400"
                    form="creditCardForm"
                    type="submit"
                    disabled={!formik.isValid || loading}
                  >
                    {loading ? <Loader /> : editMode ? "Save" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditcardForm;

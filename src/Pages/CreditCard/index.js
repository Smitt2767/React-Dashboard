import React, { useEffect } from "react";
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

const CreditcardForm = ({ location }) => {
  const query = queryString.parse(location.search);

  const initialValues = {
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    balance: "",
  };

  useEffect(() => {
    if (query.popup) {
      const creditCardFormData = JSON.parse(
        localStorage.getItem("creditCardFormData")
      );
      console.log(creditCardFormData);
      if (!!creditCardFormData) {
        Object.keys(initialValues).forEach((key) => {
          initialValues[key] = creditCardFormData[key];
        });
      }
    }
  }, [query.popup]);

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

  const onSubmit = (values) => {
    console.log(values);

    formik.resetForm();
    localStorage.removeItem("creditCardFormData");
  };

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit,
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("creditCardFormData");
    };
  }, []);

  useEffect(() => {
    if (formik.dirty)
      localStorage.setItem(
        "creditCardFormData",
        JSON.stringify({
          ...formik.values,
        })
      );
  }, [formik.values]);

  const handleChange = (label, value) => {
    formik.setFieldValue(label, value);
  };

  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="w-full h-full ">
      <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
        <div className="mb-4 flex items-center w-full">
          <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer flex-grow">
            Credit Card Form
          </h1>
          {!!!query.popup && (
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

        <div className="h-full w-full flex items-center justify-center overflow-y-auto">
          <div className="max-w-lg bg-gray-100 shadow-xl w-96 rounded-lg  relative">
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
                    disabled={
                      !formik.isValid || (!query.popup && !formik.dirty)
                    }
                  >
                    Submit
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

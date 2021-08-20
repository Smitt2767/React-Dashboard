import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import Alert from "../../Components/Modal/Alert";
import { BsPencil, BsTrash } from "react-icons/bs";
import CustomTable from "../../Components/CustomTable";
import api from "../../services/api";
import { setSuccessMessage, setErrorMessage } from "../../store/dashboardSlice";

const CKList = ({ history }) => {
  // const { ckTableData, showModal, page, limit, hasMore, totalRecords } =
  //   useSelector((state) => state.ck);

  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [id, setId] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: (originalRow, rowIndex) => {
          return (
            <div className="flex h-full justify-center items-center ">
              <h1 className="text-xl font-bold">{originalRow.cc_id}</h1>
            </div>
          );
        },
        width: 80,
      },
      {
        Header: "Card Holder",
        accessor: (originalRow, rowIndex) => {
          return (
            <div className="flex h-full justify-center items-center ">
              <h1 className="text-lg font-bold">
                {originalRow.card_holder_name}
              </h1>
            </div>
          );
        },
      },
      {
        Header: "Card Number",
        accessor: (originalRow, rowIndex) => {
          const c1 = originalRow.card_number.slice(0, 4);
          const c2 = originalRow.card_number.slice(4, 8);
          const c3 = originalRow.card_number.slice(8, 12);
          const c4 = originalRow.card_number.slice(12, 16);
          return (
            <div className="flex h-full justify-center items-center ">
              <h1 className="text-lg font-bold">{`${c1} ${c2} ${c3} ${c4}`}</h1>
            </div>
          );
        },
      },
      {
        Header: "Expiry Month",
        accessor: (originalRow, rowIndex) => {
          const exp_mnth = originalRow.expiry_month.toString();
          return (
            <div className="flex h-full justify-center items-center ">
              <h1 className="text-lg font-bold">
                {exp_mnth.length === 1 ? `0${exp_mnth}` : exp_mnth}
              </h1>
            </div>
          );
        },
        width: 120,
      },
      {
        Header: "Expiry Year",
        accessor: (originalRow, rowIndex) => {
          return (
            <div className="flex h-full justify-center items-center ">
              <h1 className="text-lg font-bold">{originalRow.expiry_year}</h1>
            </div>
          );
        },
        width: 120,
      },
      {
        Header: "CVV",
        accessor: (originalRow, rowIndex) => {
          return (
            <div className="flex h-full justify-center items-center ">
              <h1 className="text-lg font-bold">{originalRow.cvv}</h1>
            </div>
          );
        },
        width: 100,
      },
      {
        Header: "Balance",
        accessor: (originalRow, rowIndex) => {
          return (
            <div className="flex h-full justify-center items-center ">
              <h1 className="text-lg font-bold">${originalRow.balance}</h1>
            </div>
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
                  history.push(`/creditCardForm/${originalRow.cc_id}`);
                }}
              >
                <BsPencil className="text-lg lg:text-2xl text-gray-50 " />
              </button>
              <button
                className="bg-red-500 rounded-full p-2 lg:p-3  hover:bg-red-700 shadow-lg"
                onClick={() => {
                  setId(originalRow.cc_id);
                  setShowModal(true);
                }}
              >
                <BsTrash className="text-lg lg:text-2xl text-gray-50" />
              </button>
            </div>
          );
        },
        Footer: `Total Records - ${totalRecords}`,
        minWidth: 150,
      },
    ],
    [totalRecords, dispatch, history]
  );

  useEffect(() => {
    return () => {
      setRows([]);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/cc", { page, limit });
        if (res.status) {
          const totalRecords = res.data.totalRecords;
          const currentRecords = page * limit;
          if (totalRecords > currentRecords) setHasMore(true);
          else setHasMore(false);

          setRows((prev) => [...prev, ...res.data.data]);
          setTotalRecords(totalRecords);
          setLoading(false);
        }
      } catch (e) {
        if (e.response?.data) {
          dispatch(setErrorMessage(e.response?.data.message));
          setLoading(false);
        }
      }
    })();
  }, [dispatch, page, limit]);

  const next = () => {
    setPage(page + 1);
  };

  const handleButtonClick = (data) => {
    setShowModal(data);
  };

  const handleYesBtnClicked = async () => {
    if (id) {
      try {
        setLoading(true);
        const res = await api.delete(`cc/${id}`);
        if (res) {
          setRows((prev) => prev.filter((rec) => rec.cc_id !== id));
          dispatch(setSuccessMessage(res.data.message));
          setLoading(false);
          setTotalRecords((prev) => prev - 1);
        }
      } catch (e) {
        if (e.response?.data) {
          dispatch(setErrorMessage(e.response?.data.message));
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-8">
        Credit Card List
      </h1>

      {showModal && id && (
        <Alert
          setShowModal={handleButtonClick}
          handleYesBtnClicked={handleYesBtnClicked}
        />
      )}

      <CustomTable
        columns={columns}
        data={rows}
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

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { AiOutlineFilePdf, AiOutlineFileExcel } from "react-icons/ai";
import { BiFilterAlt } from "react-icons/bi";
import axios from "axios";
import moment from "moment";
import constants from "../../constants";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import FileDownload from "js-file-download";
import Loader from "../../Components/Loader";
import QueryBuilderModal from "./QueryBuilderModal";
import { useDispatch } from "react-redux";
import { setColumns } from "./store/agGridSlice";

const AgGrid = () => {
  const [gridApi, setGridApi] = useState(null);
  const [loadingXlsx, setLoadingXlsx] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [params, setParams] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const columns = [
    {
      headerName: "Id",
      field: "id",
      filter: "agNumberColumnFilter",
      cellRenderer: "loading",
      width: 100,
    },
    {
      headerName: "Athlete",
      field: "athlete",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Age",
      field: "age",
      filter: "agNumberColumnFilter",
      width: 100,
    },
    {
      headerName: "Country",
      field: "country",
      filter: "agTextColumnFilter",
      chartDataType: "category",
    },
    {
      headerName: "Year",
      field: "year",
      filter: "agNumberColumnFilter",
      width: 130,
    },
    {
      headerName: "Date",
      field: "date",
      filter: "agDateColumnFilter",
      cellRendererFramework: (params) => {
        return moment(params.value).format("DD/MM/YYYY");
      },
      width: 210,
    },
    {
      headerName: "Sport",
      field: "sport",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      headerName: "Gold",
      field: "gold",
      filter: "agNumberColumnFilter",
      width: 100,
      chartDataType: "series",
    },
    {
      headerName: "Silver",
      field: "silver",
      filter: "agNumberColumnFilter",
      width: 100,
      chartDataType: "series",
    },
    {
      headerName: "Bronze",
      field: "bronze",
      filter: "agNumberColumnFilter",
      width: 100,
      chartDataType: "series",
    },
    {
      headerName: "Total",
      field: "total",
      filter: "agNumberColumnFilter",
      cellRendererFramework: (params) => {
        const { data } = params;
        if (!!data) {
          return data.gold + data.silver + data.bronze;
        } else return 0;
      },
      cellStyle: (params) => {
        const { data } = params;
        if (!!data) {
          const value = data.gold + data.silver + data.bronze;
          return value > 4
            ? { borderLeft: "4px solid green" }
            : { borderLeft: "4px solid red" };
        } else return {};
      },
      width: 100,
      chartDataType: "series",
    },
  ];

  useEffect(() => {
    dispatch(
      setColumns(
        columns.map((column) => {
          return {
            filterType:
              column.filter === "agDateColumnFilter"
                ? "date"
                : column.filter === "agNumberColumnFilter"
                ? "number"
                : "text",
            name: column.field,
            type:
              column.filter === "agDateColumnFilter"
                ? "equals"
                : column.filter === "agNumberColumnFilter"
                ? "equals"
                : "contains",
          };
        })
      )
    );
  }, [dispatch]);

  const datasource = {
    async getRows(params) {
      const { startRow, filterModel, sortModel, endRow } = params;
      // Filter
      const filter = filterModel;

      // Sort
      const sorting = {};
      if (sortModel.length) {
        const { sort, colId } = sortModel[0];
        sorting.sort = colId;
        sorting.order = sort;
      }
      setParams({
        filter,
        ...sorting,
      });
      try {
        const res = await axios(`${constants.API_URL}/olympic`, {
          params: {
            start: startRow,
            limit: endRow - startRow,
            filter,
            ...sorting,
          },
        });
        params.successCallback(res.data.data, res.data.totalRecords);
      } catch (err) {
        params.failCallback();
        console.log(err);
      }
    },
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.setDatasource(datasource);
  };

  const components = {
    loading: (params) => {
      if (params.value !== undefined) {
        return params.value;
      } else {
        return '<img src="https://www.ag-grid.com/example-assets/loading.gif"/>';
      }
    },
  };

  const onSelectionChanged = (e) => {
    console.log(e.api.getSelectedRows());
  };

  const getChartToolbarItems = () => {
    return ["chartDownload", "chartData", "chartSettings"];
  };

  const handleXlsxDownload = async () => {
    try {
      setLoadingXlsx(true);
      const res = await axios.get(`${constants.API_URL}/olympic/generateXlsx`, {
        responseType: "arraybuffer",
        params,
      });
      if (res.status) {
        const data = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=UTF-8",
        });

        FileDownload(data, "olympic.xlsx");
        setLoadingXlsx(false);
      }
    } catch (err) {
      console.log(err);
      setLoadingXlsx(false);
    }
  };
  const handlePDFTableDownload = async () => {
    try {
      setLoadingPdf(true);
      const res = await axios.get(
        `${constants.API_URL}/olympic/generatePdfTable`,
        {
          responseType: "arraybuffer",
          params,
        }
      );

      if (res.status) {
        const data = new Blob([res.data], {
          type: "application/pdf",
        });

        FileDownload(data, "olympic.pdf");
        setLoadingPdf(false);
      }
    } catch (err) {
      console.log(err);
      setLoadingPdf(false);
    }
  };

  const StatusBarLeftComponent = (props) => {
    return (
      <div className="w-full h-12 flex items-center">
        <div
          className="bg-gray-200 text-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-300"
          onClick={() => {
            setShowModal(!showModal);
          }}
        >
          <BiFilterAlt className="text-xl " />
        </div>
      </div>
    );
  };

  const StatusBarRightComponent = ({ api }) => {
    const handleClearBtnClick = () => {
      api.setFilterModel(null);
    };

    return (
      <div className="w-full h-12 flex items-center">
        <button
          className="px-4 py-1 text-gray-100 font-bold text-md bg-yellow-400 hover:bg-yellow-500 rounded-full"
          onClick={handleClearBtnClick}
        >
          Clear
        </button>
      </div>
    );
  };

  return (
    <>
      {showModal && (
        <QueryBuilderModal setShowModal={setShowModal} gridApi={gridApi} />
      )}
      <div className="w-full h-full">
        <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
          <div className="flex  items-center mb-4 w-full ">
            <div className="flex-grow flex items-center">
              <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer">
                Ag Grid
              </h1>
              <p className="text-sm text-gray-500 font-bold ml-1 self-end hidden lg:block capitalize">
                with infinite scrolling / filter (based on number, text, date) /
                sort (by asc, desc) / custom column (total).
              </p>
            </div>

            <div className="flex-none flex items-center">
              <button
                className="text-2xl bg-blue-600 text-gray-200 p-3 rounded-full shadow-xl hover:bg-blue-700 hover:text-gray-50 focus:outline-none mr-2"
                onClick={() => {
                  handleXlsxDownload();
                }}
                disabled={loadingXlsx}
              >
                {loadingXlsx ? <Loader /> : <AiOutlineFileExcel />}
              </button>
              <button
                className="text-2xl bg-red-600 text-gray-200 p-3 rounded-full shadow-xl hover:bg-red-700 hover:text-gray-50 focus:outline-none "
                onClick={() => {
                  handlePDFTableDownload();
                }}
                disabled={loadingPdf}
              >
                {loadingPdf ? <Loader /> : <AiOutlineFilePdf />}
              </button>
            </div>
          </div>

          <div className="w-full h-full overflow-auto">
            <div className="ag-theme-alpine w-full h-full">
              <AgGridReact
                columnDefs={columns}
                rowModelType={"infinite"}
                // pagination={true}
                paginationPageSize={20}
                cacheBlockSize={50}
                onGridReady={onGridReady}
                defaultColDef={{
                  filter: true,
                  floatingFilter: true,
                  sortable: true,
                  resizable: true,
                  minWidth: 100,
                }}
                enableRangeSelection={true}
                components={components}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
                rowMultiSelectWithClick
                enableCharts={true}
                getChartToolbarItems={getChartToolbarItems}
                frameworkComponents={{
                  statusBarLeftComponent: StatusBarLeftComponent,
                  statusBarRightComponent: StatusBarRightComponent,
                }}
                statusBar={{
                  statusPanels: [
                    {
                      statusPanel: "statusBarLeftComponent",
                      align: "left",
                    },
                    {
                      statusPanel: "statusBarRightComponent",
                      align: "right",
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgGrid;

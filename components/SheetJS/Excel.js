import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { WorkBook, Worksheet, utils, writeFile } from "xlsx";
import DataGrid, { TextEditor } from "react-data-grid";
import { XIcon, ChevronDownIcon } from "@heroicons/react/solid";
import uploadFileToBlob, {
  isStorageConfigured,
} from "../../utils/azure-storage-blob";
import SuccessCheck from "../Misc/SuccessCheck";

//Confirm that the storage account is configured and is online
const storageConfigured = isStorageConfigured();
export default function Excel({ data }) {
  //Site Data Declaration
  const [array, setarray] = useState(data);
  //State representation for Blob Storage
  // all blobs in container
  const [blobList, setBlobList] = useState([]);
  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);
  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const [buttonText, setbuttonText] = useState("Upload!");
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [siteSelected, setsiteSelected] = useState(null);

  //Excel component state management
  const [fileName, setfileName] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowCount, setrowCount] = useState(null);
  const [columns, setColumns] = useState([]);
  const [workBook, setWorkBook] = useState({});
  const [sheets, setSheets] = useState([]);
  const [current, setCurrent] = useState("");
  const fileRef = useRef();

  //Handle File Upload from client for Excel functions for file preview
  const handleFile = async (e) => {
    const file = e.target.files[0];
    setfileName(file.name);
    const rawData = await file.arrayBuffer();
    //Set the workbook for further processing
    const wb = XLSX.read(rawData);
    //read out the workbook content
    //Set the workbook sheets
    const wsSheets = wb.Sheets;
    //Set the workbook names
    const ws = wsSheets[wb.SheetNames[0]];
    const wsName = wsSheets[wb.SheetNames[0]];
    const wsRange = XLSX.utils.decode_range(wsSheets[wb.SheetNames[0]]["!ref"]);
    setrowCount(wsRange.e.r);
    setSheets(wb.SheetNames);
    const temprows = utils.sheet_to_json(wsSheets[wb.SheetNames[0]], {
      header: 1,
    });

    const { rows, columns } = getRowsCols(wsName);

    //Set rows and columns to be displayed in the data grid
    setRows(rows);
    setColumns(columns);
  };

  //Get rows from file uploaded to be loaded into the DataGrid
  const getRowsCols = (wsName) => {
    const rows = utils.sheet_to_json(wsName, { header: 2 });
    const headers = utils.sheet_to_json(wsName, { header: 1 });

    let columns = [];

    for (let row of rows) {
      const keys = Object.keys(row);

      if (keys.length > columns.length) {
        columns = keys.map((key) => {
          return { key, name: key, editor: TextEditor };
        });
      }
    }

    return { rows, columns };
  };

  const handleRemove = () => {
    setfileName(null);
    setSheets([]);
  };

  //Blob Storge functions for file upload to the Cloud
  const onFileChange = (e) => {
    //Capture the file into state
    setFileSelected(e.target.files[0]);
  };
  const onFileUpload = async () => {
    const newFile = new File([fileSelected], siteSelected+'-'+month+'-'+year + ".xlsx");
    //Prepare UI
    setUploading(true);
    setbuttonText("Uploading File...");
    //Upload to Azure Storage
    // const blobsInContainer = await uploadFileToBlob(fileSelected);
    const blobsInContainer = await uploadFileToBlob(newFile);
    //Prepare UI for results
    setBlobList(blobsInContainer);

    //Reset state/form
    setFileSelected(null);
    // setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  return (
    <>
      <div className="flex justify-start py-3">
        <div className="mb-3 xl:w-auto flex mr-2">
          <select
            className="form-select
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    focus:text-gray-700 focus:bg-white focus:border-[#ffb500] focus:outline-none"
            name="siteselection"
            id=""
            onChange={(e) => setsiteSelected(e.target.value)}
          >
            {array
            .sort((a,b) => a.DPMSites - b.DPMSites)
            .map(function (name, idx) {
              return (
                <option key={idx} value={name.DPMSites}>
                  {name.DPMSites}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-3 xl:w-auto flex mr-2">
          <select
            className="form-select
                  block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding bg-no-repeat
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  focus:text-gray-700 focus:bg-white focus:border-[#ffb500] focus:outline-none"
            aria-label=""
            onChange={(e) => setMonth(e.target.value)}
            defaultValue={month}
          >
            <option value="0">Select Month for Upload</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className="mb-3 xl:w-auto flex">
          <select
            className="form-select
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    focus:text-gray-700 focus:bg-white focus:border-[#ffb500] focus:outline-none"
            aria-label=""
            onChange={(e) => setYear(e.target.value)}
            defaultValue={year}
          >
            <option value="0">Select Year for Upload</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {sheets.length > 0 ? (
        <>
          <div className="flex justify-between p-4 ">
            <div>
              <h3>
                <strong> Uploaded File: </strong>
                {fileName}
              </h3>
              {sheets.map((sheet, idx) => (
                <h3 key={sheet} value={idx}>
                  <strong> Current Sheet: </strong>
                  {sheet}
                </h3>
              ))}
            </div>
            <div className="flex">
              {fileName && (
                <>
                  <p className=" mr-2 ">remove file</p>
                  <XIcon
                    onClick={handleRemove}
                    className=" flex h-6 w-6 cursor-pointer text-red-600 hover:scale-105"
                  />
                </>
              )}
            </div>
          </div>
          <div className="">
            <p className="ml-2 mb-2 underline text-[#ffb500]">
              Previewing: {rowCount} rows
            </p>
            <DataGrid
              defaultColumnOptions={{
                sortable: true,
                resizable: true,
              }}
              columns={columns}
              rows={rows}
              onRowsChange={setRows}
              className="max-h-96 rounded-md shadow-lg scrollbar-hide"
            />
          </div>
          <div className="">
            {uploading === false ? (
              <button
                className=" mt-6 text-center w-36 bg-[#FFB500] rounded-full text-white p-1 font-medium hover:bg-[#AF6D04]"
                type="submit"
                onClick={onFileUpload}
              >
                {buttonText}
              </button>
            ) : (
              <img
                src="/images/success.gif"
                alt=""
                className="w-16 mt-2 ml-2"
              />
            )}
          </div>
        </>
      ) : (
        <div className="mx-auto ">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-[#ffe199] dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  XLS or XLSX (MAX. 4TB)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => {
                  handleFile(e);
                  onFileChange(e);
                }}
                className="hidden"
                ref={fileRef}
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
}

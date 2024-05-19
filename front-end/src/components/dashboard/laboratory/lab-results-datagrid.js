import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling,
  HeaderFilter
 } from "devextreme-react/data-grid";
import { labData } from "@/assets/dummy-data/laboratory";
import { Grid,Chip } from "@mui/material";
import { MdLocalPrintshop } from "react-icons/md";

import { downloadPDF } from "@/redux/service/pdfs";
import { useAuth } from "@/assets/hooks/use-auth";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { LuMoreHorizontal } from "react-icons/lu";
import ApproveResults from "./add-result/ApproveResults";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const getActions = () => {
  let actions = [
    {
      action: "approve",
      label: "Approve Results",
      icon: <MdLocalPrintshop className="text-success text-xl mx-2" />,
    },
    {
      action: "print",
      label: "Print",
      icon: <MdLocalPrintshop className="text-success text-xl mx-2" />,
    },
  ];

  return actions;
};

const LabResultDataGrid = ({ labResults, qualitativeLabResults }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const auth = useAuth();
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [approveOpen ,setApproveOpen] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  
  //   FILTER PATIENTS BASED ON SEARCH QUERY
  const filteredData = labData.filter((patient) => {
    return patient?.name
      ?.toLocaleLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const handlePrint = async (data) => {
    const pdf_endpoint = data.category ?  "_labtestresult_pdf" : "_qualitative_labtestresult_pdf"
      try{
          const response = await downloadPDF(data.id, `${pdf_endpoint}`, auth)
          window.open(response.link, '_blank');
          toast.success("got pdf successfully")

      }catch(error){
          console.log(error)
          toast.error(error)
      }
      
  };

  const onMenuClick = async (menu, data) => {
    if (menu.action === "dispense") {
      dispatch(getAllPrescriptionsPrescribedDrugs(data.id, auth))
      setSelectedRowData(data);
      setOpen(true);
    }else if (menu.action === "print"){
      handlePrint(data);
    }else if (menu.action === "approve"){
      setSelectedData(data);
      setApproveOpen(true)
    }
  };

  const actionsFunc = ({ data }) => {
    return (
        <CmtDropdownMenu
          sx={{ cursor: "pointer" }}
          items={userActions}
          onItemClick={(menu) => onMenuClick(menu, data)}
          TriggerComponent={
            <LuMoreHorizontal className="cursor-pointer text-xl flex items-center" />
          }
        />
    );
  };

  return (
    <>
      <Grid className="my-2 flex gap-8 justify-between">
        <Grid className="flex justify-between gap-8 rounded-lg w-full">
          <select className="px-4 w-full py-2 border broder-gray rounded-lg focus:outline-none" name="" id="">
              <option value="" selected>
                All the Items
              </option>
            </select>
        </Grid>
        <Grid className="flex bg-white px-2 items-center rounded-lg w-full" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg'/>
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search referrals by facility"
          />
        </Grid>
        <Grid className="bg-primary w-full rounded-md flex items-center text-white" item md={4} xs={4}>
          <Link className="mx-4 w-full text-center" href='/dashboard/laboratory/add-results'>
            Add Test Result
          </Link>
        </Grid>
      </Grid>

      {/* DATAGRID STARTS HERE */}
      <h2 className='text-xl my-4 text-orange'>Quantitative Results</h2>
      <DataGrid
        dataSource={labResults}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        // height={"70vh"}
        className="w-full shadow"
      >
        <HeaderFilter visible={true} />
        <Scrolling rowRenderingMode='virtual'></Scrolling>
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
        />
        <Column dataField="id" caption="Result ID" />
        <Column dataField="title" caption="Title"  />
        <Column dataField="date_created" caption="Date Created" />
        <Column
          dataField="lab_test_request"
          caption="Test Request"
          allowFiltering={true}
          allowSearch={true}
        />
        <Column 
          dataField="" 
          caption=""
          cellRender={actionsFunc}
        />
      </DataGrid>

      <h2 className='text-xl my-4 text-orange'>Qualitative Results</h2>

      <DataGrid
        dataSource={qualitativeLabResults}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        // height={"70vh"}
        className="w-full shadow"
      >
        <HeaderFilter visible={true} />
        <Scrolling rowRenderingMode='virtual'></Scrolling>
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
        />
        <Column dataField="id" caption="Result ID" />
        <Column dataField="title" caption="Title"  />
        <Column dataField="date_created" caption="Date Created" />
        <Column
          dataField="lab_test_request"
          caption="Test Request"
          allowFiltering={true}
          allowSearch={true}
        />
        <Column 
          dataField="" 
          caption=""
          cellRender={actionsFunc}
        />
      </DataGrid>
      {approveOpen && (<ApproveResults selectedData={selectedData} approveOpen={approveOpen} setApproveOpen={setApproveOpen}/>)}
    </>
  );
};

export default LabResultDataGrid;

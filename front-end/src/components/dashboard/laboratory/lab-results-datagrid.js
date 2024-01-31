import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { Column, Paging, Pager, Scrolling,
  HeaderFilter
 } from "devextreme-react/data-grid";
import { labData, months } from "@/assets/dummy-data/laboratory";
import { Grid,Chip } from "@mui/material";
import { AiFillDelete,AiOutlineDownload,AiFillPrinter } from 'react-icons/ai';
import { MdLocalPrintshop } from "react-icons/md";

import { downloadPDF } from "@/redux/service/pdfs";
import { useAuth } from "@/assets/hooks/use-auth";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const allowedPageSizes = [5, 10, 'all'];

const LabResultDataGrid = ({ labResults }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const auth = useAuth();
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);
  
  //   FILTER PATIENTS BASED ON SEARCH QUERY
  const filteredData = labData.filter((patient) => {
    return patient?.name
      ?.toLocaleLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const renderGridCell = (rowData) => {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span
            style={{ marginLeft: '5px', cursor: 'pointer' }}
            onClick={() => handlePrint(rowData)}
          >
            <MdLocalPrintshop />
          </span>
        </div>
      );
  };

  const handlePrint = async (data) => {
      console.log(data.values[0]);
      try{
          const response = await downloadPDF(data.values[0], "_labtestresults_pdf", auth)
          window.open(response.link, '_blank');
          toast.success("got pdf successfully")

      }catch(error){
          console.log(error)
          toast.error(error)
      }
      
  };

  const priorityFunc = ({ data }) => {
    if (data?.priority === "Priority") {
      return (
        <div className="flex items-center gap-2">
          <p>{data?.name}</p>
          <Chip variant="outlined" size="small" style={{ borderColor: "#FC4B1B" }} label={data?.priority} />
        </div>
      );
    }else{
        return <p>{data?.name}</p>
    }
  };

  return (
    <>
      <Grid className="my-2 flex justify-between">
        <Grid className="flex justify-between gap-8 rounded-lg">
          <Grid item md={4} xs={4}>
            <select className="px-4 w-full py-2 border broder-gray rounded-lg focus:outline-none" name="" id="">
              <option value="" selected>                
              </option>
              {months.map((month, index) => (
                <option key={index} value="">
                  {month.name}
                </option>
              ))}
            </select>
          </Grid>
          <Grid>
          <select className="px-4 w-full py-2 border broder-gray rounded-lg focus:outline-none" name="" id="">
              <option value="" selected>
                All the Items
              </option>
            </select>
          </Grid>        
        </Grid>
        <Grid className="flex items-center rounded-lg" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg'/>
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search referrals by facility"
          />
        </Grid>
        <Grid className="bg-primary rounded-md flex items-center text-white" item md={4} xs={4}>
          <Link className="mx-4" href='/dashboard/laboratory/add-results'>
            Add Test Result
          </Link>
        </Grid>
      </Grid>

      {/* DATAGRID STARTS HERE */}
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
        height={"70vh"}
        className="w-full shadow"
      >
        <HeaderFilter visible={true} />
        <Scrolling rowRenderingMode='virtual'></Scrolling>
        <Paging defaultPageSize={5} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons}
        />
        <Column dataField="id" caption="Result ID" />
        <Column dataField="title" caption="Title"  />
        <Column dataField="date_created" caption="Date Created"  cellRender={priorityFunc} />
        <Column
          dataField="lab_test_request"
          caption="Test Request"
          allowFiltering={true}
          allowSearch={true}
        />
        <Column
          dataField=""
          caption=""
          alignment="center"
          cellRender={(rowData) => renderGridCell(rowData)}
        />
      </DataGrid>
    </>
  );
};

export default LabResultDataGrid;

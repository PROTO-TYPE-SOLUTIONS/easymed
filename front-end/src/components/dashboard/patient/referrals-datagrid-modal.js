import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import dynamic from "next/dynamic";
import { Column, Paging, Pager } from "devextreme-react/data-grid";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const ReferralsDataGridModal = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const users = [
    {
      number: "1",
      id_number: "1234821",
      name: "Marcos Ochieng",
      country: "Kenya",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      number: "2",
      id_number: "70081234",
      name: "Derrick Kimani",
      country: "Uganda",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      number: "3",
      id_number: "1234821",
      name: "Jane Munyua",
      country: "Tanzania",
      gender: "Female",
      age: "70",
      status: "Active",
    },
    {
      number: "3",
      id_number: "70081234",
      name: "Ann Kibet",
      country: "Burundi",
      gender: "Male",
      age: "49",
      status: "Active",
    },
    {
      number: "4",
      id_number: "1234821",
      name: "Ann Ochieng",
      country: "Rwanda",
      gender: "Female",
      age: "88",
      status: "Active",
    },
    {
      number: "5",
      id_number: "1234821",
      name: "Marcos Ochieng",
      country: "Kenya",
      gender: "Male",
      age: "34",
      status: "Active",
    },
    {
      number: "6",
      id_number: "70081234",
      name: "Derrick Kimani",
      country: "Uganda",
      gender: "Male",
      age: "23",
      status: "Active",
    },
    {
      number: "7",
      id_number: "1234821",
      name: "Jane Munyua",
      country: "Tanzania",
      gender: "Female",
      age: "70",
      status: "Active",
    },
  ];

  return (
    <section>
      <button
        onClick={handleClickOpen}
        className="md:block hidden border-2 border-gray-300 rounded px-2 py-2 text-sm"
      >
        View Referrals
      </button>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DataGrid
            dataSource={users}
            allowColumnReordering={true}
            rowAlternationEnabled={true}
            showBorders={true}
            remoteOperations={true}
            showColumnLines={true}
            showRowLines={true}
            wordWrapEnabled={true}
            allowPaging={true}
            // height={"60vh"}
            className="w-full"
          >
            <Pager
              visible={true}
              // allowedPageSizes={allowedPageSizes}
              showPageSizeSelector={true}
              showNavigationButtons={true}
            />
            <Column dataField="number" caption="Date" width={80} />
            <Column dataField="id_number" caption="ID" width={140} />
            <Column
              dataField="name"
              caption="Patient"
              width={200}
              allowFiltering={true}
              allowSearch={true}
            />
            <Column dataField="age" caption="From" width={140} />
            <Column dataField="country" caption="Notes" width={200} />
            <Column dataField="gender" caption="Last Modified" width={200} />
          </DataGrid>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReferralsDataGridModal;

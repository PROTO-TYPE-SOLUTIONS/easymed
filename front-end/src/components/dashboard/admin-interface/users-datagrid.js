import React from "react";
import dynamic from "next/dynamic";
import { Column, Paging, Pager } from "devextreme-react/data-grid";
import CmtDropdownMenu from "@/assets/DropdownMenu";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { LuMoreHorizontal } from "react-icons/lu";
import EditUserDetailsModal from "./edit-user-details-modal";
import DeleteUserModal from "./delete-user-modal";
import AdminCreateUser from "./admin-create-user";
import { Grid } from "@mui/material";

const DataGrid = dynamic(() => import("devextreme-react/data-grid"), {
  ssr: false,
});

const getActions = () => {
  let actions = [
    {
      action: "delete",
      label: "Delete",
      icon: <AiFillDelete className="text-warning text-xl mx-2" />,
    },
    {
      action: "edit",
      label: "Edit",
      icon: <BiEdit className="text-xl text-success  mx-2" />,
    },
  ];

  return actions;
};

const AdminUsersDataGrid = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const userActions = getActions();
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState({});

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
  ];

  const onMenuClick = async (menu, data) => {
    if (menu.action === "delete") {
      setSelectedRowData(data);
      setDeleteOpen(true);
    } else if (menu.action === "edit") {
      setSelectedRowData(data);
      setOpen(true);
    }
  };

  const actionsFunc = ({ data }) => {
    return (
      <>
        <CmtDropdownMenu
          sx={{ cursor: "pointer" }}
          items={userActions}
          onItemClick={(menu) => onMenuClick(menu, data)}
          TriggerComponent={
            <LuMoreHorizontal className="cursor-pointer text-xl" />
          }
        />
      </>
    );
  };

  //   filter users based on search query
  const filteredUser = users.filter((user) => {
    return user.name.toLocaleLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <section>
      <Grid className="my-2 flex justify-between gap-4">
        <Grid className="flex items-center rounded-lg bg-white px-2 w-full" item md={4} xs={4}>
          <img className="h-4 w-4" src='/images/svgs/search.svg'/>
          <input
            className="py-2 w-full px-4 bg-transparent rounded-lg focus:outline-none placeholder-font font-thin text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            fullWidth
            placeholder="Search by name"
          />
        </Grid>
        <div className="w-full flex justify-end">
          <AdminCreateUser />
        </div>
      </Grid>
      <DataGrid
        dataSource={filteredUser}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        remoteOperations={true}
        showColumnLines={true}
        showRowLines={true}
        wordWrapEnabled={true}
        allowPaging={true}
        className="shadow-xl"
        // height={"70vh"}
      >
        <Pager
          visible={true}
          // allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Column dataField="number" caption="NO" width={80} />
        <Column dataField="id_number" caption="ID" width={140} />
        <Column
          dataField="name"
          caption="Name"
          width={200}
          allowFiltering={true}
          allowSearch={true}
        />
        <Column dataField="age" caption="Age" width={140} />
        <Column dataField="country" caption="Country" width={200} />
        <Column dataField="gender" caption="Gender" width={200} />
        <Column
          dataField="country"
          caption="Action"
          width={200}
          cellRender={actionsFunc}
        />
      </DataGrid>
      <EditUserDetailsModal {...{ open, setOpen, selectedRowData }} />
      <DeleteUserModal {...{ deleteOpen, setDeleteOpen, selectedRowData }} />
    </section>
  );
};

export default AdminUsersDataGrid;

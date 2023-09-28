import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RiMessage2Fill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

const TopSection = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const id = open2 ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Anchor the menu to the current target (the image)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
        <section className="flex items-center gap-4 sticky top-0 bg-white md:bg-opacity-30 md:backdrop-filter md:backdrop-blur-lg p-2 relative">
          <span style={{fontSize: '8px'}} className="absolute top-0 left-0">22 Sept 2023</span>
          <div className="flex items-center gap-4 border-r-2 border-black">
            <AiOutlineSearch
              onClick={handleClick2}
              className="text-2xl cursor-pointer"
            />
            <RiMessage2Fill className="text-2xl cursor-pointer" />
            <IoMdNotifications className="text-2xl cursor-pointer" />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <img
                onClick={handleClick}
                className="h-8 w-8 rounded-full cursor-pointer"
                src="/images/doc.jpg"
                alt=""
              />
            </div>
            <div className="text-xs">
              <p className="font-semibold">Dr. Patrick</p>
              <p>Surgeon</p>
            </div>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>

          <div>
            <Popover
              id={id}
              open={open2}
              anchorEl={anchorEl2}
              onClose={handleClose2}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {/* <form className="p-4 space-y-3"> */}
              <section className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <TextField fullWidth label="Search Patient" type="text" />
                  <TextField fullWidth label="Search Doctor" type="text" />
                </div>
                <div className="flex items-center gap-3">
                  <DatePicker size="small" label="From Date" />
                  <DatePicker size="small" label="To Date" />
                </div>
                <button
                  onClick={handleClose2}
                  className="bg-[#02273D] px-3 py-3 rounded text-white w-full"
                >
                  Search
                </button>
              </section>
              {/* </form> */}
            </Popover>
          </div>
        </section>
    </>
  );
};

export default TopSection;

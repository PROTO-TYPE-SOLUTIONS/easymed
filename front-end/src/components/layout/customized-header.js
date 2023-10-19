import { Container } from "@mui/material";
import React, { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Drawer } from "@/assets/drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsChevronDown } from "react-icons/bs";

const CustomizedHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Anchor the menu to the current target (the image)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <section className="sticky top-0 py-4 bg-primary shadow-xl h-[10vh]">
        <Container maxWidth="xl">
          <section className="flex items-center md:justify-end justify-between gap-4">
            <div className="md:hidden block">
              <AiOutlineMenu
                className="text-2xl cursor-pointer text-white"
                onClick={() => setIsOpen(true)}
              />
              <Drawer {...{ isOpen, setIsOpen }} />
            </div>
            <div className="flex items-center gap-2">
              <img
                className="h-8 w-8 rounded-full"
                src="/images/doc.jpg"
                alt=""
              />
              <span className="text-white">Marcos</span>
              <BsChevronDown onClick={handleClick} className="text-white cursor-pointer" />
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
          </section>
        </Container>
      </section>
    </>
  );
};

export default CustomizedHeader;

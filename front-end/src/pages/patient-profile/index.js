import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { getPatientProfile } from "@/redux/features/patients";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid } from "@mui/material";
import AuthGuard from "@/assets/hoc/auth-guard";
import ProfileLayout from "@/components/layout/profile-layout";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import { useAuth } from "@/assets/hooks/use-auth";
import PersonalDetails from "@/components/patient-profile/personal-details";
import { TbLogout2 } from "react-icons/tb";
import { authContext } from "@/components/use-context";
import { FaUserCircle } from "react-icons/fa";
import BookAppointmentModal from "./book-appointment-modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoChevronDownOutline } from "react-icons/io5";
import LabServiceModal from "./lab-service-modal";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { profileDetails } = useSelector((store) => store.patient);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { logoutUser } = useContext(authContext);
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(getPatientProfile(auth.user_id));
    }
  }, [auth]);

  return (
    <AuthGuard>
      <Container>
        <section className="flex items-center justify-between border-b border-gray p-8 profilePage text-white">
          <div className="flex items-center gap-4">
            <Link href="/">
              <BsArrowLeft className="text-xl" />
            </Link>
            <FaUserCircle className="w-12 h-12" />
            <h1 className="text-xl">
              {profileDetails.first_name} {profileDetails.second_name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Created on 4th July 2021</span>
            <button
              onClick={logoutUser}
              className="bg-primary text-sm text-white shadow-xl px-8 py-2 rounded-xl flex items-center gap-3"
            >
              <TbLogout2 />
              Logout
            </button>
          </div>
        </section>
        <Grid container spacing={4}>
          <Grid item md={12} xs={12}>
            <section className="my-8 space-y-8 ">
              <section className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl text-primary">Personal Information</h1>
                </div>
                <div>
                  <div
                    onClick={handleClick}
                    className="flex items-center cursor-pointer gap-2 bg-primary text-white rounded-xl p-2"
                  >
                    <p className="text-sm">Select Service</p>
                    <IoChevronDownOutline className="font-bold cursor-pointer" />
                  </div>
                  <div>
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
                      <MenuItem>
                        <BookAppointmentModal />
                      </MenuItem>
                      <MenuItem>
                        <LabServiceModal />
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </section>
              <PersonalDetails />
            </section>
          </Grid>
          {/* <Grid item md={3} xs={12}>
            <section className="my-8 space-y-4">
              <MedicalHistory />
            </section>
          </Grid>
          <Grid item md={3} xs={12}>
            <section className="my-8 space-y-4">
              <Prescriptions />
            </section>
          </Grid>
          <Grid item md={3} xs={12}>
            <section className="my-8 space-y-4">
              <AppointmentHistory />
            </section>
          </Grid> */}
        </Grid>
      </Container>
    </AuthGuard>
  );
};

PatientProfile.getLayout = (page) => <ProfileLayout>{page}</ProfileLayout>;

export default PatientProfile;

import React, { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { getPatientProfile } from "@/redux/features/patients";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid } from "@mui/material";
import AppointmentHistory from "@/components/patient-profile/appointment-history";
import AuthGuard from "@/assets/hoc/auth-guard";
import ProfileLayout from "@/components/layout/profile-layout";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import MedicalHistory from "@/components/patient-profile/medical-history";
import Prescriptions from "@/components/patient-profile/prescriptions";
import { useAuth } from "@/assets/hooks/use-auth";
import PersonalDetails from "@/components/patient-profile/personal-details";
import { TbLogout2 } from "react-icons/tb";
import { authContext } from "@/components/use-context";
import { FaUserCircle } from "react-icons/fa";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { profileDetails } = useSelector((store) => store.patient);
  console.log("PARENT_PROFILE_DETAILS ", profileDetails);

  const { logoutUser } = useContext(authContext);
  const auth = useAuth();

  console.log("PATIENT_AUTH ", auth);
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl text-primary">Personal Information</h1>
                </div>
                <div>
                  <Link href="/book-appointment" className="bg-primary text-white shadow-xl px-4 text-sm py-2 rounded-xl">
                    Book Appointment
                  </Link>
                </div>
              </div>
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

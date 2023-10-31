import React, { useEffect,useContext } from "react";
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
import { TbLogout2 } from 'react-icons/tb'
import { authContext } from "@/components/use-context";


const PatientProfile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((store) => store.patient);
  const { logoutUser } = useContext(authContext);
  const auth = useAuth();
  console.log("PROFILE_DETAILS ", profile);
  const router = useRouter();
  const { patientId } = router.query;

  console.log("PROFILE_AUTH ", auth);

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfile(patientId));
    }
  }, []);

  return (
    <AuthGuard>
      <Container>
        <section className="flex items-center justify-between border-b border-gray p-8 profilePage text-white">
          <div className="flex items-center gap-4">
            <Link href="/">
              <BsArrowLeft className="text-xl" />
            </Link>
            <img
              className="w-16 h-16 rounded-full shadow-xl"
              src="/images/avatar1.png"
              alt=""
            />
            <h1 className="text-xl">Marcos Ochieng</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Created on 4th July 2021</span>
            <button onClick={logoutUser} className="bg-primary text-sm text-white shadow-xl px-8 py-2 rounded-xl flex items-center gap-3">
              <TbLogout2 />
              Logout
            </button>
          </div>
        </section>
        <Grid container spacing={4}>
          <Grid item md={3} xs={12}>
            <section className="my-8 space-y-4 ">
              <h1 className="text-xl text-primary">Personal Information</h1>
              <PersonalDetails />
            </section>
          </Grid>
          <Grid item md={3} xs={12}>
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
          </Grid>
        </Grid>
      </Container>
    </AuthGuard>
  );
};

PatientProfile.getLayout = (page) => <ProfileLayout>{page}</ProfileLayout>;

export default PatientProfile;

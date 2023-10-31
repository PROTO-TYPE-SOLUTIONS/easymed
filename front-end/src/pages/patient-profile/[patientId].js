import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getPatientProfile } from "@/redux/features/patients";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid } from "@mui/material";
import AppointmentHistory from "@/components/patient-profile/appointment-history";
import AuthGuard from "@/assets/hoc/auth-guard";
import ProfileLayout from "@/components/layout/profile-layout";
import { BsArrowLeft, BsImageFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((store) => store.patient);
  console.log("PROFILE_DETAILS ", profile);
  const router = useRouter();
  const { patientId } = router.query;

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfile(patientId));
    }
  }, []);

  return (
    <AuthGuard>
      <Container>
        <section className="flex items-center justify-between border-b border-gray pb-8">
          <div className="flex items-center gap-4">
            <BsArrowLeft className="text-xl" />
            <img
              className="w-16 h-16 rounded-full shadow-xl"
              src="/images/avatar1.png"
              alt=""
            />
            <h1 className="text-xl font-semibold">Marcos Ochieng</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Created on 4th July 2021</span>
            <button className="bg-primary text-white shadow-xl px-8 py-2 rounded-xl flex items-center gap-3">
              <FiEdit />
              Edit
            </button>
          </div>
        </section>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <section className="my-8 space-y-4">
              <h1 className="uppercase">Profile Image</h1>
              <img
                className="w-44 h-48 rounded shadow-xl"
                src="/images/avatar1.png"
                alt=""
              />
              <div className="flex items-center gap-4 text-link">
                <BsImageFill />
                <p className="text-sm font-semibold">
                  Change Profile Image
                </p>
              </div>
              {/* <div className="flex items-center gap-4">
                <p className="uppercase font-semibold">Role :</p>
                <p>Patient</p>
              </div> */}
            </section>
          </Grid>
          <Grid item md={9} xs={12}>
            <section className="my-8 space-y-4"></section>
            hello
          </Grid>
        </Grid>
      </Container>
    </AuthGuard>
  );
};

PatientProfile.getLayout = (page) => <ProfileLayout>{page}</ProfileLayout>;

export default PatientProfile;

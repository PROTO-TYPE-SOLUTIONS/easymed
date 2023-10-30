import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getPatientProfile } from "@/redux/features/patients";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid } from "@mui/material";
import AppointmentHistory from "@/components/patient-profile/appointment-history";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((store) => store.patient);
  console.log("PROFILE_DETAILS ",profile);
  const router = useRouter();
  const { patientId } = router.query;

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfile(patientId));
    }
  }, []);

  return (
    <>
      <section className="bg-background h-screen space-y-8">
        <header className="bg-primary text-white p-4">
          <Container>Marcos Profile</Container>
        </header>
        <Container>
          <section className="">
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <section className="bg-white shadow-xl rounded p-4 flex gap-4">
                  <div className="space-y-3 w-3/12">
                    <img
                      className="rounded-full h-24 w-24"
                      src="/images/doc.jpg"
                      alt=""
                    />
                    <button className="bg-primary text-white px-4 py-2">
                      Edit Profile
                    </button>
                  </div>
                  <div className="space-y-3">
                    <h1 className="font-semibold text-xl">Marcos Ochieng</h1>
                    <p>marcos@gmail.com</p>
                    <p className="">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Tempora ipsa, incidunt placeat eveniet ullam nesciunt
                      iusto cupiditate labore praesentium dolorum?
                    </p>
                  </div>
                </section>
              </Grid>
              <Grid item md={12} xs={12}>
                <section className="flex items-center gap-4 my-4">
                  <h1 className="text-xl">Appointment History</h1>
                  <h1 className="text-xl">Medical History</h1>
                  <h1 className="text-xl">Prescriptions</h1>
                </section>
                <section>
                  <AppointmentHistory />
                </section>
              </Grid>
            </Grid>
          </section>
        </Container>
      </section>
    </>
  );
};

export default PatientProfile;

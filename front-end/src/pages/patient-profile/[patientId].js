import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getPatientProfile } from "@/redux/features/patients";
import { useDispatch,useSelector } from "react-redux";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((store) => store.patient);
  const router = useRouter();
  const { patientId } = router.query;


  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfile(patientId));
    }
  }, []);
  
  return <div>PatientProfile</div>;
};

export default PatientProfile;

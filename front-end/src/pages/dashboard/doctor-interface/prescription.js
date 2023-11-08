import CustomizedLayout from "@/components/layout/customized-layout";
import { Container } from "@mui/material";
import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import AllPrescriptions from "@/components/dashboard/doctor-interface/prescriptions";

const Prescription = () => {
  const router = useRouter();
  const { data } = router.query;
  const [show, setShow] = React.useState(false);

  // Decode and parse the data back to the original object
  const decodedData = data ? JSON.parse(decodeURIComponent(data)) : null;

  console.log("DECODED_DATA ", decodedData);

  const initialValues = {
    drug_name: "",
  };

  const handleSearch = async (formValue, helpers) => {
    try {
      const formData = {
        ...formValue,
        role: "doctor",
        profession: "",
        groups: [],
      };
      setLoading(true);
      await registerUser(formData, authUser).then(() => {
        helpers.resetForm();
        setLoading(false);
        handleClose();
        toast.success("Doctor Created Successfully!");
        dispatch(getAllDoctors(authUser));
      });
    } catch (err) {
      setLoading(false);
      toast.error(err);
    }
  };

  return (
    <Container maxWidth="xl" className="my-4">
      <section className="flex items-center gap-2">
        <div>
          <MdOutlineKeyboardBackspace />
        </div>
        <div>
          <h1 className="">Prescription</h1>
        </div>
      </section>
      <section className="flex items-center gap-2 mt-8">
        <div className="w-7/12">
          <input
            name="drug_name"
            placeholder="Prescription Id"
            className="block border rounded-3xl bg-background border-gray py-3 text-sm px-4 focus:outline-none w-full"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-primary w-full rounded-3xl px-4 text-sm py-3 text-white"
            onClick={() => setShow(true)}
          >
            Add Drug
          </button>
        </div>
      </section>
      { show && <AllPrescriptions /> }
    </Container>
  );
};

Prescription.getLayout = (page) => <CustomizedLayout>{page}</CustomizedLayout>;

export default Prescription;

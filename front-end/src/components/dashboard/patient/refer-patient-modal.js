import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Divider } from "@mui/material";
import { TextField, Autocomplete, Grid } from "@mui/material";
import { getAutoCompleteValue } from "@/assets/file-helper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ReferPatientModal = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const gender = [
    {
      id: 1,
      name: "Male",
    },
    {
      id: 2,
      name: "Female",
    },
  ];

  const validationSchema = Yup.object().shape({
    patientId: Yup.string().required("This field is required!"),
    medicationId: Yup.string().required("This field is required!"),
    facility_name: Yup.string().required("This field is required!"),
    section: Yup.string().required("This field is required!"),
    residence: Yup.string().required("This field is required!"),
    notes: Yup.string().required("This field is required!"),
  });

  const formik = useFormik({
    initialValues: {
      patientId: null,
      medicationId: null,
      facility_name: "",
      section: "",
      residence: "",
      notes: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("FORMIK_VALUES ", values);
      // await dispatch(createSponsorUser(authUser, values));
    },
  });

  const handleOnPatientId = (event, value) => {
    if (value !== null) {
      formik.setFieldValue("patientId", value.id);
    } else {
      formik.setFieldValue("patientId", null);
    }
  };

  const handleOnMedicationId = (event, value) => {
    if (value !== null) {
      formik.setFieldValue("medicationId", value.id);
    } else {
      formik.setFieldValue("medicationId", null);
    }
  };

  return (
    <section>
      <button
        onClick={handleClickOpen}
        className="md:block hidden border border-primary rounded px-2 py-2 text-sm"
      >
        Refer Patient
      </button>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <section className="space-y-2">
              <p>Patient</p>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    options={gender}
                    value={getAutoCompleteValue(
                      gender,
                      formik.values.patientId
                    )}
                    getOptionLabel={(option) => option.name}
                    onChange={handleOnPatientId}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        fullWidth
                        {...params}
                        label="Patient"
                        name="patientId"
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.patientId &&
                          Boolean(formik.errors.patientId)
                        }
                        helperText={
                          formik.touched.patientId &&
                          formik.errors.patientId
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    options={gender}
                    value={getAutoCompleteValue(
                      gender,
                      formik.values.medicationId
                    )}
                    getOptionLabel={(option) => option.name}
                    onChange={handleOnMedicationId}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        fullWidth
                        {...params}
                        label="Medication"
                        name="medicationId"
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.medicationId &&
                          Boolean(formik.errors.medicationId)
                        }
                        helperText={
                          formik.touched.medicationId &&
                          formik.errors.medicationId
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Divider />
              <p>Referring to :</p>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    maxWidth="sm"
                    size="small"
                    label="Facility Name"
                    name="facility_name"
                    value={formik.values.facility_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.facility_name &&
                      Boolean(formik.errors.facility_name)
                    }
                    helperText={
                      formik.touched.facility_name &&
                      formik.errors.facility_name
                    }
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    maxWidth="sm"
                    size="small"
                    label="Section"
                    name="section"
                    value={formik.values.section}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.section && Boolean(formik.errors.section)
                    }
                    helperText={formik.touched.section && formik.errors.section}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    maxWidth="sm"
                    size="small"
                    label="Residence"
                    name="residence"
                    value={formik.values.residence}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.residence &&
                      Boolean(formik.errors.residence)
                    }
                    helperText={
                      formik.touched.residence && formik.errors.residence
                    }
                  />
                </Grid>
              </Grid>
              <Divider />
              <p>Notes</p>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows="4"
                    maxWidth="sm"
                    size="small"
                    label="Notes"
                    name="notes"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.notes && Boolean(formik.errors.notes)}
                    helperText={formik.touched.notes && formik.errors.notes}
                  />
                </Grid>
              </Grid>
              <Divider />
              <div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-[#02273D] px-4 py-2 rounded-3xl text-white"
                  >
                    Refer Patient
                  </button>
                  <button
                    type="submit"
                    onClick={handleClose}
                    className="border border-[#02273D] px-4 py-2 rounded-3xl text-[#02273D]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReferPatientModal;

import { Grid, TextField, Autocomplete } from "@mui/material";
import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getAutoCompleteValue } from "@/assets/file-helper";

const AddInventoryForm = () => {
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
    first_name: Yup.string().required("This field is required!"),
    second_name: Yup.string().required("This field is required!"),
    last_name: Yup.string().required("This field is required!"),
    date_of_birth: Yup.date()
      .required("Date of Birth is required")
      .max(new Date(), "Date of Birth cannot be in the future"),
    genderId: Yup.string().required("This field is required!"),
    telephone: Yup.string().required("This field is required!"),
    email: Yup.string().required("This field is required!"),
    residence: Yup.string().required("This field is required!"),
    provider: Yup.string().required("This field is required!"),
    card_number: Yup.string().required("This field is required!"),
    package: Yup.string().required("This field is required!"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      second_name: "",
      last_name: "",
      date_of_birth: "",
      genderId: null,
      telephone: "",
      email: "",
      residence: "",
      provider: "",
      card_number: "",
      package: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("FORMIK_VALUES ", values);
      // await dispatch(createSponsorUser(authUser, values));
    },
  });

  const handleOnGenderId = (event, value) => {
    console.log(value);
    if (value !== null) {
      formik.setFieldValue("genderId", value.id);
    } else {
      formik.setFieldValue("genderId", null);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="">
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            maxWidth="sm"
            label="Product Name"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Autocomplete
            options={gender}
            value={getAutoCompleteValue(gender, formik.values.genderId)}
            getOptionLabel={(option) => option.name}
            onChange={handleOnGenderId}
            renderInput={(params) => (
              <TextField
                size="small"
                fullWidth
                {...params}
                label="Category"
                name="genderId"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.genderId && Boolean(formik.errors.genderId)
                }
                helperText={formik.touched.genderId && formik.errors.genderId}
              />
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            maxWidth="sm"
            label="Price"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            maxWidth="sm"
            label="Quantity"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Autocomplete
            options={gender}
            value={getAutoCompleteValue(gender, formik.values.genderId)}
            getOptionLabel={(option) => option.name}
            onChange={handleOnGenderId}
            renderInput={(params) => (
              <TextField
                size="small"
                fullWidth
                {...params}
                label="Unit Price"
                name="genderId"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.genderId && Boolean(formik.errors.genderId)
                }
                helperText={formik.touched.genderId && formik.errors.genderId}
              />
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            maxWidth="sm"
            label=" Buying Price"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            maxWidth="sm"
            label="Description"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-primary px-8 py-2 rounded text-white"
            >
              Save
            </button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddInventoryForm;

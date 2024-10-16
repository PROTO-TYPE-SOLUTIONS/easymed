import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import { useSelector,useDispatch } from "react-redux";
import { getAllInsurance } from "@/redux/features/insurance";
import { editPatient } from "@/redux/service/patients";
import { toast } from 'react-toastify'
import { getAllPatients } from "@/redux/features/patients";
import SeachableSelect from "@/components/select/Searchable";
import { updateItem } from "@/redux/service/inventory";
import { useAuth } from '@/assets/hooks/use-auth';
import { updateAnItem } from "@/redux/features/inventory";
import { IoMdAdd } from "react-icons/io";
const CreateTestPanelModal = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const auth = useAuth();

  const units = [
        {value: 'unit', label: 'unit'}, 
        {value: 'mg', label: 'milligrams'},
        {value: 'g', label: 'grams'},
        {value: 'kg', label: 'kilograms'},
        {value: 'ml', label: 'millilitres'},
        {value: 'L', label: 'litres'}
    ]

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  }


  const initialValues = {
    item: "",
    specimen: "",
    test_profile: "",
    name: "",
    unit: ""
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Field is Required!"),
    item: Yup.object().required("Field is Required!"),
    specimen: Yup.object().required("Field is Required!"),
    test_profile: Yup.object().required("Field is Required!"),
    unit: Yup.object().required("Field is Required!"),
  });

  const handleEditItem = async (formValue, helpers) => {
    const formData = {
        ...formValue,
        category: formValue.category.value,
        units_of_measure: formValue.units_of_measure.value
    };
    try {
      setLoading(true);
      const response = await updateItem(parseInt(selectedRowData?.id), formData, auth)
      dispatch(updateAnItem(response))
      setLoading(false);
      toast.success("Item Updated Successfully!");
      handleClose();

    } catch (err) {
      toast.error(err);
      console.log("EDIT_ERROR ", err);
    }
  };

  return (
        <>
        <button
          onClick={handleClickOpen}
          className="bg-primary rounded-xl text-white px-4 py-2 text-sm flex items-center gap-1"
        >
          <IoMdAdd /> Create Test Panel
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
            <section className="flex items-center justify-center gap-8 overflow-hidden">
              <div className="w-full space-y-4 px-4">
                <h1 className="text-xl text-center">Create Test Panel</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleEditItem}
                    >
                    <Form className="">
                        <Grid container spacing={2}>
                        <Grid className='my-2' item md={6} xs={12}>
                        <label htmlFor="item_code">Panel Name</label>
                            <Field
                            className="block border rounded-md text-sm border-gray py-2.5 px-4 focus:outline-card w-full"
                            maxWidth="sm"
                            placeholder="Panel Name"
                            name="name"
                            />
                            <ErrorMessage
                            name="name"
                            component="div"
                            className="text-warning text-xs"
                            />
                        </Grid>
                        <Grid className='my-2' item md={6} xs={12}>
                            <SeachableSelect
                                label="Select Item"
                                name="item"
                                options={units.map((item) => ({ value: item.value, label: `${item?.label}` }))}
                            />
                            <ErrorMessage
                                name="item"
                                component="div"
                                className="text-warning text-xs"
                            />
                        </Grid>
                        <Grid className='my-2' item md={6} xs={12}>
                            <SeachableSelect
                                label="Select Unit"
                                name="unit"
                                options={units.map((item) => ({ value: item.value, label: `${item?.label}` }))}
                            />
                            <ErrorMessage
                                name="unit"
                                component="div"
                                className="text-warning text-xs"
                            />
                        </Grid>
                        <Grid className='my-2' item md={6} xs={12}>
                            <SeachableSelect
                                label="Select Specimen"
                                name="specimen"
                                options={units.map((item) => ({ value: item.value, label: `${item?.label}` }))}
                            />
                            <ErrorMessage
                                name="specimen"
                                component="div"
                                className="text-warning text-xs"
                            />
                        </Grid>
                        <Grid className='my-2' item md={12} xs={12}>
                            <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                className="bg-primary rounded-xl text-sm px-8 py-2 text-white"
                            >
                                {loading && (
                                <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                    ></path>
                                    <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="#1C64F2"
                                    ></path>
                                </svg>
                                )}
                                Add Item
                            </button>
                            </div>
                        </Grid>
                        </Grid>
                    </Form>
                </Formik>
              </div>
            </section>
          </DialogContent>
        </Dialog>
      </>
  );
};

export default CreateTestPanelModal;

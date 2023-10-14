import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import * as Yup from "yup";
import { addInventory } from "@/redux/service/inventory";
import { useSelector, useDispatch } from "react-redux";
import { getAllItems, getAllSuppliers } from "@/redux/features/inventory";
import { toast } from "react-toastify";

const AddInventoryForm = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { items, suppliers } = useSelector(({ inventory }) => inventory);

  const locations = [
    {
      id: 1,
      name: "laboratory",
    },
    {
      id: 2,
      name: "radiology",
    },
    {
      id: 3,
      name: "pharmacy",
    },
    {
      id: 4,
      name: "reception",
    },
  ];

  const initialValues = {
    quantity: "",
    location: "",
    expiry_date: "",
    purchase_price: "",
    sale_price: "",
    item_ID: null,
    supplier_ID: null,
  };

  const validationSchema = Yup.object().shape({
    quantity: Yup.string().required("This field is required!"),
    location: Yup.string().required("This field is required!"),
    expiry_date: Yup.string().required("This field is required!"),
    purchase_price: Yup.string().required("This field is required!"),
    sale_price: Yup.string().required("This field is required!"),
    item_ID: Yup.string().required("This field is required!"),
    supplier_ID: Yup.string().required("This field is required!"),
  });

  const handleAddInventory = async (formValue, helpers) => {
    try {
      const formData = {
        ...formValue,
        item_ID: parseInt(formValue.item_ID),
        supplier_ID: parseInt(formValue.supplier_ID),
      };
      setLoading(true);
      await addInventory(formData).then(() => {
        helpers.resetForm();
        toast.success("Inventory Added Successfully!");
        setLoading(false);
      });
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    dispatch(getAllSuppliers());
    dispatch(getAllItems());
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleAddInventory}
    >
      <Form className="">
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Field
              className="block border border-primary rounded py-3 px-4 focus:outline-none w-full"
              maxWidth="sm"
              placeholder="Quantity"
              name="quantity"
            />
            <ErrorMessage
              name="quantity"
              component="div"
              className="text-warning text-xs"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Field
              as="select"
              className="block border border-primary rounded py-3 px-4 focus:outline-none w-full"
              maxWidth="sm"
              placeholder="Location"
              name="location"
            >
              <option value="">Select Location</option>
              {locations?.map((location) => (
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="location"
              component="div"
              className="text-warning text-xs"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Field
              className="block border border-primary rounded py-3 px-4 focus:outline-none w-full"
              maxWidth="sm"
              type="date"
              placeholder="Expiry Date"
              name="expiry_date"
            />
            <ErrorMessage
              name="expiry_date"
              component="div"
              className="text-warning text-xs"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Field
              className="block border border-primary rounded py-3 px-4 focus:outline-none w-full"
              maxWidth="sm"
              placeholder="Purchase Price"
              name="purchase_price"
            />
            <ErrorMessage
              name="purchase_price"
              component="div"
              className="text-warning text-xs"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Field
              className="block border border-primary rounded py-3 px-4 focus:outline-none w-full"
              maxWidth="sm"
              placeholder="Sale Price"
              name="sale_price"
            />
            <ErrorMessage
              name="sale_price"
              component="div"
              className="text-warning text-xs"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Field
              as="select"
              className="block pr-9 border border-primary rounded py-3 px-4 focus:outline-none w-full"
              name="item_ID"
            >
              <option value="">Select Item</option>
              {items?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="item_ID"
              component="div"
              className="text-warning text-xs"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Field
              as="select"
              className="block pr-9 border border-primary rounded py-3 px-4 focus:outline-none w-full"
              name="supplier_ID"
            >
              <option value="">Select Supplier</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="supplier_ID"
              component="div"
              className="text-warning text-xs"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="bg-primary px-8 py-2 rounded text-white"
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
                Add Inventory
              </button>
            </div>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};

export default AddInventoryForm;

import React, { useEffect,useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import * as Yup from "yup";
import { addInventory } from "@/redux/service/inventory";
import { useSelector, useDispatch } from "react-redux";
import { getAllItems, getAllSuppliers } from "@/redux/features/inventory";
import { toast } from "react-toastify";

const AddInventoryForm = () => {
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  const { items, suppliers } = useSelector(({ inventory }) => inventory);

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
    console.log(formValue);
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
      console.log("INVENTORY_ERROR ", err);
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
              className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
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
              className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
              maxWidth="sm"
              placeholder="Location"
              name="location"
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-warning text-xs"
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Field
              className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
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
              className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
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
              className="block border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
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
              className="block pr-9 border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
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
              className="block pr-9 border border-primary rounded-xl py-3 px-4 focus:outline-none w-full"
              name="supplier_ID"
            >
              <option value="">Select Supplier</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
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
                className="bg-primary px-8 py-2 rounded-3xl text-white"
              >
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

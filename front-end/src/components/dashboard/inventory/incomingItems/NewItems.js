import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { getAllItems, getAllSuppliers, getItems, getAllPurchaseOrders } from "@/redux/features/inventory";
import { addIncomingItem } from "@/redux/service/inventory";
import { toast } from "react-toastify";
import SeachableSelect from "@/components/select/Searchable";
import { useAuth } from "@/assets/hooks/use-auth";

const NewItems = () => {

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter()
    const { item, suppliers, purchaseOrders } = useSelector((store) => store.inventory);
    const auth = useAuth();
  
  
    const initialValues = {
      quantity: "",
      packed: "",
      subpacked: "",
      purchase_price: "",
      sale_price: "",
      item: "",
      supplier:"",
      purchase_order: "",
      category_one: null,
    };
  
    const validationSchema = Yup.object().shape({
      quantity: Yup.string().required("This field is required!"),
      packed: Yup.string().required("This field is required!"),
      subpacked: Yup.string().required("This field is required!"),
      purchase_price: Yup.string().required("This field is required!"),
      sale_price: Yup.string().required("This field is required!"),
      item: Yup.object().required("This field is required!"),
      supplier: Yup.object().required("This field is required!"),
      purchase_order: Yup.object().required("This field is required!"),
      category_one: Yup.object().required("This field is required!"),
    });
  
    const handleAddIncomingItems = async (formValue, helpers) => {
      try {

        setLoading(true);

        const formData = {
          ...formValue,
          item: parseInt(formValue.item.value),
          category_one: formValue.category_one.label,
          supplier: parseInt(formValue.supplier.value),
          purchase_order: parseInt(formValue.purchase_order.value)
        };
  
        await addIncomingItem(formData, auth).then((res)=>{
          console.log(res)
           helpers.resetForm();
           toast.success("Item Added Successfully!");
           setLoading(false);
           router.push('/dashboard/inventory/incoming-items')
        })
      } catch (err) {
        toast.error(err);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if(auth){
        dispatch(getAllSuppliers());
        dispatch(getAllItems(auth));
        dispatch(getItems(auth));
        dispatch(getAllPurchaseOrders(auth));
      }
    }, [auth]);

  return (
    <section>
        <div className="flex items-center gap-4 mb-8">
        {/* <Link href='/dashboard/inventory'><img className="h-3 w-3" src="/images/svgs/back_arrow.svg" alt="return to inventory"/></Link> */}
        <img onClick={() => router.back()} className="h-3 w-3 cursor-pointer" src="/images/svgs/back_arrow.svg" alt="go back"/>
        <h3 className="text-xl"> Add New Incoming Item </h3>
        </div>
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleAddIncomingItems}
        >
        <Form className="">
            <Grid container spacing={2}>
            <Grid className='my-2' item md={6} xs={12}>
                <SeachableSelect
                    label="Select Item"
                    name="item"
                    options={item.map((item) => ({ value: item.id, label: `${item?.name}` }))}
                />
                <ErrorMessage
                    name="item"
                    component="div"
                    className="text-warning text-xs"
                />
            </Grid>
            <Grid className='my-2' item md={6} xs={12}>
                <SeachableSelect
                    label="Select Supplier"
                    name="supplier"
                    options={suppliers.map((supplier) => ({ value: supplier.id, label: `${supplier?.name}` }))}
                />
                <ErrorMessage
                    name="supplier"
                    component="div"
                    className="text-warning text-xs"
                />
            </Grid>
            <Grid className='my-2' item md={6} xs={12}>
                <SeachableSelect
                    label="Select Category"
                    name="category_one"
                    options={["Resale", "Internal"].map((category) => ({ value: category, label: `${category}` }))}
                />
                <ErrorMessage
                    name="category_one"
                    component="div"
                    className="text-warning text-xs"
                />
            </Grid>
            <Grid className='my-2' item md={6} xs={12}>
                <SeachableSelect
                    label="Select Purchase Order"
                    name="purchase_order"
                    options={purchaseOrders.map((purchaseOrder) => ({ value: purchaseOrder.id, label: `${purchaseOrder?.date_created}` }))}
                />
                <ErrorMessage
                    name="purchase_order"
                    component="div"
                    className="text-warning text-xs"
                />
            </Grid>
            <Grid className='my-2' item md={6} xs={12}>
            <label htmlFor="Purchase-Price">Purchase Price</label>
                <Field
                className="block border rounded-md text-sm border-gray py-2.5 px-4 focus:outline-card w-full"
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
            <Grid className='my-2' item md={6} xs={12}>
            <label htmlFor="Sale-Price">Sale Price</label>
                <Field
                className="block border rounded-md text-sm border-gray py-2.5 px-4 focus:outline-card w-full"
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
            <Grid className='my-2' item md={4} xs={12}>
            <label htmlFor="quantity">Quantity</label>
                <Field
                className="block border rounded-md text-sm border-gray py-2.5 px-4 focus:outline-card w-full"
                maxWidth="sm"
                placeholder="Quantity"
                name="quantity"
                type="number"
                />
                <ErrorMessage
                name="quantity"
                component="div"
                className="text-warning text-xs"
                />
            </Grid>
            <Grid className='my-2' item md={4} xs={12}>
            <label htmlFor="packed">Packed</label>
                <Field
                className="block border rounded-md text-sm border-gray py-2.5 px-4 focus:outline-card w-full"
                maxWidth="sm"
                placeholder="packed"
                name="packed"
                />
                <ErrorMessage
                name="packed"
                component="div"
                className="text-warning text-xs"
                />
            </Grid>
            <Grid className='my-2' item md={4} xs={12}>
            <label htmlFor="subpacked">Subpacked</label>
                <Field
                className="block border rounded-md text-sm border-gray py-2.5 px-4 focus:outline-card w-full"
                maxWidth="sm"
                placeholder="subpacked"
                name="subpacked"
                />
                <ErrorMessage
                name="subpacked"
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
    </section>
  )
}

export default NewItems
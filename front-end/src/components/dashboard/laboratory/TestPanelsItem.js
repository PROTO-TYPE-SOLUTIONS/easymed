import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/assets/hooks/use-auth";
import {
  fetchLabTestPanelsBySpecificSample,
  updatePhlebotomySamples,
} from "@/redux/service/laboratory";
import SeachableSelect from "@/components/select/Searchable";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormButton from "@/components/common/button/FormButton";
import { sendToEquipment } from "@/redux/service/laboratory";
import { toast } from "react-toastify";

const TestPanelsItem = ({ sample, collected, sample_id }) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [resultItems, setResultItems] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const { labTestPanels, labEquipments } = useSelector(
    (store) => store.laboratory,
  );

  const initialValues = {
    equipment: "",
  };

  const validationSchema = Yup.object().shape({
    equipment: Yup.object().required("This field is required!"),
  });

  const getTestPanelsBySampleId = async (sample, auth) => {
    try {
      const response = await fetchLabTestPanelsBySpecificSample(sample, auth);
      setResultItems(response);
    } catch (error) {
      console.log("ERROR GETTING PANELS");
    }
  };

  const approveCollection = async () => {
    try {
      const payload = {
        is_sample_collected: true,
        id: sample_id,
      };
      await updatePhlebotomySamples(payload, auth);
    } catch (error) {
      console.log("ERR APPROVING COLLECTION OF SAMPLE", error);
    }
  };

  const handleSendEquipment = async (foundPanel, formValue, helpers) => {
    if (formValue.equipment.value === "manual") {
      approveCollection();
      return;
    }
    try {
      const formData = {
        ...foundPanel,
        patient_id: foundPanel.patient_id,
        equipment: formValue.equipment.label,
      };
      console.log(formData);
      setLoading(true);
      approveCollection();
      await sendToEquipment(formData).then(() => {
        helpers?.resetForm();
        toast.success("Send to Equipment Successful!");
        setLoading(false);
      });
    } catch (err) {
      toast.error("Failed to send to equipment");
      console.log("ERROR SENDING TO EQUIPMENT", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      getTestPanelsBySampleId(sample, auth);
    }
  }, [sample]);

  const panels = resultItems.map((item) => {
    const foundPanel = labTestPanels.find(
      (panel) => panel.id === item.test_panel,
    );
    if (foundPanel) {
      return (
        <li key={`${foundPanel.id}_panel`}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handleSendEquipment(item, values, { resetForm });
            }}
          >
            {({ handleSubmit, values }) => (
              <form
                onSubmit={handleSubmit}
                className="w-full flex items-center bg-red-400"
              >
                <span className="w-10/12">{foundPanel.name}</span>
                <div className="w-full">
                  <SeachableSelect
                    name="equipment"
                    setSelectedItem={(value) => setSelectedEquip(value)}
                    options={[
                      { value: "manual", label: "Manual" },
                      ...labEquipments.map((equipment) => ({
                        value: equipment.id,
                        label: equipment.name,
                      })),
                    ]}
                  />
                </div>
                {item.is_billed ? (
                    <div className="w-full justify-end flex">
                      <button
                        disabled={!values.equipment || loading}
                        type="submit"
                        className={`${!values.equipment ? "bg-gray cursor-not-allowed" : "bg-primary"} text-white cursor-pointer w-10/12 text-center py-2 text-xs rounded-xl flex justify-center items-center`}
                      >
                        {loading ? "Sending..." : "send"}
                      </button>
                  </div>
                ) : (
                  <>
                    <div className="w-full justify-center flex">
                      <div className="w-10/12 bg-primary text-white cursor-default px-3 py-2 text-xs rounded-xl text-center">
                        Not Applicable
                      </div>
                    </div>
                  </>
                )}
              </form>
            )}
          </Formik>
        </li>
      );
    }
  });

  return (
    <>
      <ul className="flex gap-3 flex-col px-4">
        <li className="flex justify-between">
          <span className="text-primary w-full">panel name</span>
          <span className="text-primary w-full">select equipment</span>
          <span className="text-primary w-full text-center ">
            action
          </span>
          <span className="text-primary w-5/12"></span>
        </li>
        {panels}
      </ul>
    </>
  );
};

export default TestPanelsItem;
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Checkbox, DialogTitle, Grid } from "@mui/material";
import { toast } from "react-toastify";
import { fetchLabTestPanelsByProfileId, sendLabRequests, sendLabRequestsPanels, updateLabRequest } from "@/redux/service/laboratory";
import { useAuth } from "@/assets/hooks/use-auth";
import { getAllPatients, getAllProcesses } from "@/redux/features/patients";
import { useDispatch, useSelector } from "react-redux";
import { getAllLabTestProfiles, getAllLabTestPanelsByProfile } from "@/redux/features/laboratory";
import { updateAttendanceProcesses } from "@/redux/service/patients";

const DirectToTheLabModal = ({ labOpen, setLabOpen, selectedData }) => {
  const { labTestProfiles, labTestPanelsById } = useSelector((store) => store.laboratory);
  const { patientTriage, patients } = useSelector((store) => store.patient);
  const [loading, setLoading] = React.useState(false);
  const [testProfile, setTestProfile]= useState(null)
  const [selectedPanels, setSelectedPanels] = useState([]);
  const auth = useAuth();
  const dispatch = useDispatch();

  const patient = patients.find((patient)=> patient.id === selectedData.patient)

  const handleClose = () => {
    setLabOpen(false);
    setTestProfile(null)
  };

  const initialValues = {
    note: "",
    process: selectedData?.process_test_req,
    test_profile: null,
    requested_by: null,
  };

  const validationSchema = Yup.object().shape({
    note: Yup.string().required("This field is required!"),
  });

  const saveAllPanels = async (testReqPanelPayload) => {
    try{
      await sendLabRequestsPanels(testReqPanelPayload, auth)
      toast.success("Lab Request Panels saved Successful!");
      dispatch(getAllProcesses())
    }catch(error){
      console.log(error)
      toast.error(error)
    }
  }

  const savePanels = (reqId) => {
    selectedPanels.forEach((panel)=> {
      const testReqPanelPayload = {    
        test_panel: panel.id,
        lab_test_request: reqId      
      }
      saveAllPanels(testReqPanelPayload);
    })
  }

  const handleSendLabRequest = async (formValue, helpers) => {
    try {
      setLoading(true);
      if (formValue.test_profile){
        await sendLabRequests(formValue, auth).then((res) => {
          helpers.resetForm();
          updateAttendanceProcesses({track: "lab"}, selectedData.id)
          savePanels(res.id)
          toast.success("Lab Request Successful!");
          dispatch(getAllProcesses())
          setLoading(false);
          handleClose();
        });
      }else {
        updateAttendanceProcesses({track: "lab"}, selectedData.id)
        dispatch(getAllProcesses())
        setLoading(false);
        handleClose();
      }
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (panel) => {
    setSelectedPanels((prevSelectedPanels) => {
      const isSelected = prevSelectedPanels.find((panelItem=>panelItem.id === panel.id));

      return isSelected
        ? prevSelectedPanels.filter((item) => item.id !== panel.id)
        : [...prevSelectedPanels, panel];
    });
  };

  const handleSelectAllChange = () => {
    setSelectedPanels((prevSelectedPanels) =>
      prevSelectedPanels.length === labTestPanelsById.length
        ? [] // Unselect all if all are currently selected
        : labTestPanelsById.map((panel) => panel) // Select all if not all are currently selected
    );
  };

  const getTestPanelsByTheProfileId = async (testProfile, auth) => {
    try{
      const response = await fetchLabTestPanelsByProfileId(testProfile, auth)
      setSelectedPanels(response);
    }catch(error){

    }
  }

  useEffect(() => {
    dispatch(getAllPatients());
    dispatch(getAllLabTestProfiles(auth));
    if(testProfile){
      getTestPanelsByTheProfileId(testProfile, auth);
      dispatch(getAllLabTestPanelsByProfile(testProfile, auth));
    }
  }, [selectedData, testProfile]);

  return (
    <section>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={labOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <div className="flex justify-between">
            <p>{`${patient?.first_name} ${patient?.second_name}`}</p>
            <p>{`${patient?.gender}`}</p>
            <p>{`${patient?.age}`}</p>            
          </div>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSendLabRequest}
          >
            {({ values, handleChange }) => (
            <Form>
              <section className="space-y-2">
                <h1 className="">Triage Information</h1>
                <section className="flex items-center justify-between text-sm border-b bg-background p-1 rounded border-gray">
                  <div className="flex items-center gap-2">
                    <span>
                      Temperature :
                    </span>
                    <span>{patientTriage?.temperature}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Height :</span>
                    <span>{patientTriage?.height}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Pulse :</span>
                    <span>{patientTriage?.pulse}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Weight :</span>
                    <span>{patientTriage?.weight}</span>
                  </div>
                </section>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <section className="space-y-3">
                      <div>
                        <Field
                          as="select"
                          className="block text-sm pr-9 border border-gray rounded-xl py-2 px-4 focus:outline-none w-full"
                          onChange={(e) => {
                            handleChange(e);
                            setTestProfile(e.target.value);
                          }}
                          name="test_profile"
                        >
                          <option value="">Select Test Profile</option>
                          {labTestProfiles.map((test, index) => (
                            <option key={index} value={test.id}>
                              {test?.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="test_profile"
                          component="div"
                          className="text-warning text-xs"
                        />
                      </div>
                      {testProfile && (
                        <div>
                          <label>Select Panels</label>
                          <div className="flex items-center">
                            <Checkbox
                              checked={selectedPanels.length === labTestPanelsById.length}
                              onChange={handleSelectAllChange}
                            />
                            <span>{selectedPanels.length === labTestPanelsById.length ? "unselect all" : "select all"}</span>
                          </div>
                          <Grid container spacing={4}>
                            {labTestPanelsById.map((panel) => (
                              <Grid className="flex items-center" key={panel.id} item xs={4}>
                                <Checkbox
                                  checked={selectedPanels.some((panelItem) => panelItem.id === panel.id)}
                                  onChange={() => handleCheckboxChange(panel)}
                                />
                                <span>{panel.name}</span>
                              </Grid>
                            ))}
                          </Grid>
                        </div>
                      )}
                      <div>
                        <Field
                          as="textarea"
                          className="block border border-gray rounded-xl py-3 px-4 focus:outline-none w-full"
                          type="text"
                          placeholder="Add a Note"
                          name="note"
                        />
                        <ErrorMessage
                          name="note"
                          component="div"
                          className="text-warning text-xs"
                        />
                      </div>
                    </section>
                  </Grid>
                </Grid>
                <div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-[#02273D] px-4 py-2 text-white rounded-xl text-sm"
                    >
                      {loading && (
                        <svg
                          aria-hidden="true"
                          role="status"
                          class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
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
                      Send To Lab
                    </button>
                    <button
                      onClick={handleClose}
                      className="border border-warning rounded-xl px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </section>
            </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DirectToTheLabModal;

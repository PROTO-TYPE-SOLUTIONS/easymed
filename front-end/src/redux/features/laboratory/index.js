import { createSlice } from "@reduxjs/toolkit";
import { fetchLabRequests, 
    fetchLabResults,fetchLabEquipment, 
    fetchLabTestProfile, fetchLabTestPanels, 
    fetchPublicLabRequests, fetchSpecificPatientLabRequests,
    fetchLabTestPanelsByProfileId,
    fetchLabTestPanelsByTestRequestId,
    fetchQualitativeLabRequests,
    fetchResultPanelsByResultsId,
    fetchQualitativeResultPanelsByResultsId,
    fetchLabTestByProcessId,
    fetchSamplesForSpecificProcess,
    fetchPhlebotomySamples,
    fetchLabTestPanelsBySpecificSample,
  } from "@/redux/service/laboratory";


const initialState = {
  labResults: [],
  resultPanels: [],
  qualitativeLabResults: [],
  labResultItems: [],
  labTestPanels: [],
  labTestPanelsById: [],
  labRequests: [],
  phlebotomySamples: [],
  labRequestsByProcess: [],
  labSamplesByProcess: [],
  publicLabRequests: [],
  labEquipments: [],
  labTestProfiles: [],
  patientSpecificLabRequests: [],
  processAllTestRequest: []
};

const LaboratorySlice = createSlice({
  name: "laboratory",
  initialState,
  reducers: {
    setLabResults: (state, action) => {
      state.labResults = action.payload;
    },
    setQualitativeLabResults: (state, action) => {
      state.qualitativeLabResults = action.payload;
    },
    setLabRequests: (state, action) => {
      state.labRequests = action.payload;
    },
    setPhlebotomySamples: (state, action) => {
      state.phlebotomySamples = action.payload;
    },
    setProcessLabRequests: (state, action) => {
      state.labRequestsByProcess = action.payload;
    },
    clearProcessLabRequests: (state, action)=>{
      state.labRequestsByProcess = [];
    },
    setProcessesSamples: (state, action) => {
      state.labSamplesByProcess = action.payload;
    },
    clearProcessesSamples: (state, action)=>{
      state.labSamplesByProcess = [];
    },
    setPublicLabRequests: (state, action) => {
      state.publicLabRequests = action.payload;
    },
    setSpecificPatientLabRequests: (state, action) => {
      state.patientSpecificLabRequests = action.payload
    },
    setLabEquipments: (state, action) => {
      state.labEquipments = action.payload;
    },
    setLabTestProfile: (state, action) => {
      state.labTestProfiles = action.payload;
    },
    setLabTestPanels: (state, action) => {
      state.labTestPanels = action.payload;
    },
    setLabTestPanelsById: (state, action) => {
      state.labTestPanelsById = action.payload;
    },
    setResultPanelsByResultId: (state, action) => {
      state.resultPanels = action.payload;
    },
    clearLabResultItems: (state, action)=>{
      state.labResultItems = [];
    },
    setLabResultItemsAfterRemovingItem: (state, action) => {
      const labResultItem = state.labResultItems.filter(item => item.test_panel != action.payload.test_panel );
      state.labResultItems = labResultItem;
    },
    setLabResultItems: (state, action) => {

      const labResultItem = state.labResultItems.find(item => item.test_panel === action.payload.test_panel );
      if (labResultItem) {
        // If labResultItem is found, update the existing item in the array
        state.labResultItems = state.labResultItems.map(item =>
          item.test_panel === action.payload.test_panel ? { ...item, result:action.payload.result, lab_test_result:action.payload.lab_test_result } : item
        );
      } else {
        // If labResultItem is not found, add the new item to the array
        state.labResultItems = [...state.labResultItems, action.payload];
      }
    },
    setProcessAllTestRequest: (state, action) => {
      state.processAllTestRequest = [...state.processAllTestRequest, action.payload]
    },
    clearProcessAllTestRequest: (state, action) => {
      state.processAllTestRequest = []
    }
  },
});

export const { setLabResults, 
  setLabRequests, setPublicLabRequests, 
  setLabEquipments,setLabTestProfile, setSpecificPatientLabRequests,
  setLabResultItems, setLabResultItemsAfterRemovingItem, setResultPanelsByResultId,
  clearLabResultItems, setLabTestPanels, setLabTestPanelsById, setQualitativeLabResults,
  setProcessLabRequests, clearProcessLabRequests, setProcessAllTestRequest,
  clearProcessAllTestRequest, setProcessesSamples, clearProcessesSamples,
  setPhlebotomySamples
} = LaboratorySlice.actions;


export const getAllLabResults = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabResults(auth);
    dispatch(setLabResults(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};

export const getAllQualitativeLabResults = (auth) => async (dispatch) => {
  try {
    const response = await fetchQualitativeLabRequests(auth);
    dispatch(setQualitativeLabResults(response));
  } catch (error) {
    console.log("QUALITATIVE_RESULTS_LAB_ERROR ", error);
  }
};

export const getAllLabEquipments = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabEquipment(auth);
    dispatch(setLabEquipments(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};

export const getAllLabRequests = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabRequests(auth);
    dispatch(setLabRequests(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};

export const getAllPhlebotomySamples = (auth) => async (dispatch) => {
  try {
    const response = await fetchPhlebotomySamples(auth);
    dispatch(setPhlebotomySamples(response));
  } catch (error) {
    console.log("PHLEBOTOMY SAMPLES ", error);
  }
};

export const getAllSpecificPatientLabRequsts = (patient_id, auth) => async (dispatch) => {
  try {
    const response = await fetchSpecificPatientLabRequests(patient_id, auth);
    dispatch(setSpecificPatientLabRequests(response));

  }catch (error){
    console.log("Specific Patient Lab Requests", error)
  }
}

export const getAllPublicLabRequests = (auth) => async (dispatch) => {
  try {
    const response = await fetchPublicLabRequests(auth);
    dispatch(setPublicLabRequests(response));
  } catch (error) {
    console.log("PUBLIC_LAB_REQ_ERROR ", error);
  }
};

export const getAllLabTestProfiles = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabTestProfile(auth);
    dispatch(setLabTestProfile(response));
  } catch (error) {
    console.log("LAB_ERROR ", error);
  }
};

export const getAllLabTestPanels = (auth) => async (dispatch) => {
  try {
    const response = await fetchLabTestPanels(auth);
    dispatch(setLabTestPanels(response));
  } catch (error) {
    console.log("LAB_TSEST_PANELS_ERROR ", error);
  }
};

export const getAllLabTestPanelsByProfile = (profile_id, auth) => async (dispatch) => {
  try {
    const response = await fetchLabTestPanelsByProfileId(profile_id, auth);
    dispatch(setLabTestPanelsById(response));
  } catch (error) {
    console.log("LAB_TEST_PANELS_BY_PROFILE_ID_ERROR ", error);
  }
};

export const getAllResultPanelsByResult = (result_id, auth) => async (dispatch) => {
  try {
    const response = await fetchResultPanelsByResultsId(result_id, auth);
    dispatch(setResultPanelsByResultId(response));
  } catch (error) {
    console.log("LAB_RESULT_PANELS_BY_RESULT_ID_ERROR ", error);
  }
};

export const getAllQualitativeResultPanelsByResult = (result_id, auth) => async (dispatch) => {
  try {
    const response = await fetchQualitativeResultPanelsByResultsId(result_id, auth);
    dispatch(setResultPanelsByResultId(response));
  } catch (error) {
    console.log("LAB_RESULT_PANELS_BY_RESULT_ID_ERROR ", error);
  }
};

export const getAllLabTestPanelsByTestRequest = (test_request_id, auth) => async (dispatch) => {
  try {
    const response = await fetchLabTestPanelsByTestRequestId(test_request_id, auth);
    dispatch(clearItemsToLabResultsItems())
    response.forEach((item)=> {
      dispatch(addItemToLabResultsItems(item));
    })
  } catch (error) {
    console.log("LAB_TEST_PANELS_BY_PROFILE_ID_ERROR ", error);
  }
};

export const getAllLabTestPanelsBySample = (sample_id, auth) => async (dispatch) => {
  try {
    const response = await fetchLabTestPanelsBySpecificSample(sample_id, auth);
    dispatch(clearItemsToLabResultsItems())
    response.forEach((item)=> {
      dispatch(addItemToLabResultsItems(item));
    })
  } catch (error) {
    console.log("LAB_TEST_PANELS_BY_PROFILE_ID_ERROR ", error);
  }
};

export const getAllLabTestByProcessId = (process_id, auth) => async (dispatch) => {
  try {
    const response = await fetchLabTestByProcessId(process_id, auth);
    dispatch(clearProcessLabRequests())
      dispatch(setProcessLabRequests(response));

  } catch (error) {
    console.log("LAB_TEST_REQ_BY_PROCESS_ID_ERROR ", error);
  }
};

export const getAllSamplesForProcessId = (process_id, auth) => async (dispatch) => {
  try {
    const response = await fetchSamplesForSpecificProcess(process_id, auth);
    dispatch(clearProcessesSamples())
    dispatch(setProcessesSamples(response));

  } catch (error) {
    console.log("SAMPLES_BY_PROCESS_ID_ERROR ", error);
  }
};

export const addItemToLabResultsItems = (payload) => (dispatch) => {
  dispatch(setLabResultItems(payload));
};

export const removeItemToLabResultsItems = (payload) => (dispatch) => {
  dispatch(setLabResultItemsAfterRemovingItem(payload));
};

export const clearItemsToLabResultsItems = () => (dispatch) => {
  dispatch(clearLabResultItems());
};


export default LaboratorySlice.reducer;

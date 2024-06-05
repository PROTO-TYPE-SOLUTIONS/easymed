import React, {useEffect, useState, useRef} from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';

import { useAuth } from '@/assets/hooks/use-auth';
import TestPanelsItem from './TestPanelsItem';
import { setProcessAllTestRequest } from '@/redux/features/laboratory';
import { fetchLabTestPanelsByTestRequestId } from '@/redux/service/laboratory';
import TestResultsPanels from './TestResultsItems';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


const SampleTestAccordion = ({ testReq }) => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const effectRan = useRef(false);
    const { labRequestsByProcess, processAllTestRequest } = useSelector((store) => store.laboratory);
    const [expanded, setExpanded] = useState(null);
    const [panels, setPanels] = useState([])

    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };

    const fetchLabTestPanelsByTestRequest = async (test_id, auth)=> {
      try{
        const response = await fetchLabTestPanelsByTestRequestId(test_id, auth)
        setPanels(response)
        response.forEach((item)=> dispatch(setProcessAllTestRequest(item)))
        
      }catch(error){
        console.log("ERR GETTING PANELS", error)
      }
    }

    useEffect(() => {
      if (testReq && !effectRan.current) {
        fetchLabTestPanelsByTestRequest(testReq.id, auth);
        effectRan.current = true;
      }
    }, [testReq, auth]);

  const bgColor = testReq.has_result ? '#83f28f' : 'inherit';
  
  return (
    <Accordion key={`process_test_${testReq}`} expanded={expanded === testReq} onChange={handleChange(testReq)}>
      <AccordionSummary style={{ width: '100%', backgroundColor: bgColor }} aria-controls="panel1d-content" id="panel1d-header">
        <Typography>
            <p className='flex'>{`${testReq.test_profile_name}`}</p>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <TestResultsPanels test={testReq.id}/>
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

export default SampleTestAccordion
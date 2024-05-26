import React, {useState} from 'react';
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


const TestsAccordion = () => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const { labRequestsByProcess } = useSelector((store) => store.laboratory);
    const [expanded, setExpanded] = useState(labRequestsByProcess[0]?.id);

    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };

    const processTestRequests = labRequestsByProcess.map((test)=>{
      console.log("TESTTTTT", test)
      return  (
        <Accordion key={`process_test_${test.id}`} expanded={expanded === test.id} onChange={handleChange(test.id)}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography className='w-full'>
              <div className='flex w-full justify-between'>
                <p className='flex'>{`${test.test_profile_name}`}</p>
                <p className='flex'>{`${test.note}`}</p>
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <TestPanelsItem test={test.id}/>
            </Typography>
          </AccordionDetails>
        </Accordion>
      )
    })

    labRequestsByProcess.map(async (test)=>{
      const response = await fetchLabTestPanelsByTestRequestId(test.id, auth)
      console.log("THHEEE REEEEEEEES",response)
      if (response){
        // response.forEach((item)=> {
        //   dispatch(setProcessAllTestRequest(item))
        // })

      }
    })
  
  return (
    <div>
      {processTestRequests}
    </div>
  )
}

export default TestsAccordion
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
import { fetchLabTestPanelsBySpecificSample, fetchLabTestPanelsByTestRequestId } from '@/redux/service/laboratory';

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


const TestsAccordion = ({ sample }) => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const effectRan = useRef(false);
    const { labRequestsByProcess, processAllTestRequest } = useSelector((store) => store.laboratory);
    const [expanded, setExpanded] = useState();
    const [panels, setPanels] = useState([])

    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };

    const fetchLabTestPanelsBySpecificSample = async (sample_id, auth)=> {
      try{
        const response = await fetchLabTestPanelsBySpecificSample(sample_id, auth)
        setPanels(response)
        
      }catch(error){
        console.log("ERR GETTING PANELS", error)
      }
    }

    useEffect(() => {
      if (sample && !effectRan.current) {
        fetchLabTestPanelsBySpecificSample(sample.id, auth);
        effectRan.current = true;
      }
    }, [sample, auth]);
  
  return (
    <Accordion key={`process_sample_${sample.id}`} expanded={expanded === sample.id} onChange={handleChange(sample.id)}>
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography className='w-full'>
          <div className='flex w-full justify-between'>
            <p className='flex'>{`${sample.specimen_name}`}</p>
            <p className='flex text-warning'>{sample.sample_code}</p>
          </div>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <TestPanelsItem collected={sample.sample_collected} sample={sample.id}/>
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

export default TestsAccordion
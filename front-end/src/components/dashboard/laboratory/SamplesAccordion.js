import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import { useAuth } from '@/assets/hooks/use-auth';
import TestPanelsItem from './TestPanelsItem';

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


const SamplesAccordion = ({ sample }) => {
    const [expanded, setExpanded] = useState('');

    const handleChange = (sample) => (event, newExpanded) => {
      setExpanded(newExpanded ? sample : false);
    };
 
  return (
    <Accordion key={`process_sample_${sample.id}`} expanded={expanded === sample.id} onChange={handleChange(sample.id)}>
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography className='w-full'>
          <div className='flex w-full justify-between'>
            <p className='flex'>{`${sample.specimen_name}`}</p>
            <p className='flex'>{`${sample.patient_sample_code}`}</p>
          </div>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <TestPanelsItem collected={sample.is_sample_collected} sample={sample.id}/>
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

export default SamplesAccordion
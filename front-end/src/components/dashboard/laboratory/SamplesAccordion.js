import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import { useAuth } from '@/assets/hooks/use-auth';
import TestPanelsItem from './TestPanelsItem';
import { updatePhlebotomySamples } from '@/redux/service/laboratory';

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

const SamplesAccordion = ({ sample: initialSample }) => {
  const [sample, setSample] = useState(initialSample);
  const [expanded, setExpanded] = useState('');
  const auth = useAuth();

  const approveCollection = async (sample_id) => {
    try {
      const payload = {
        is_sample_collected: true,
        id: sample_id,
      };
      await updatePhlebotomySamples(payload, auth);
      
      // Update state
      setSample((prevSample) => ({
        ...prevSample,
        is_sample_collected: true,
      }));
    } catch (error) {
      console.log("ERR APPROVING COLLECTION OF SAMPLE", error);
    }
  };

  const handleChange = (sampleId) => (event, newExpanded) => {
    setExpanded(newExpanded ? sampleId : false);
  };

  const consumables = sample.consumables ?? [];

return (
  <div className="w-full">
    {!sample.is_sample_collected && (
      <div className='w-full bg-gray mt-2'>
        <div className='flex w-full py-2 items-center px-2 justify-between'>
          <p className='flex'>{`${sample.specimen_name}`}</p>
          <p className='flex'>{`${sample.patient_sample_code}`}</p>
          <button
            onClick={() => approveCollection(sample.id)}
            className="bg-primary text-white px-3 py-1 rounded-lg"
          >
            Collect Sample
          </button>
        </div>
        <div className='px-2 pb-2 text-xs'>
          <span className='font-semibold'>Consumables required: </span>
          {consumables.length === 0 ? (
            <span>None required for these tests</span>
          ) : (
            consumables.map((consumable, index) => {
              const short = consumable.available_quantity < consumable.quantity_per_collection;
              return (
                <span key={consumable.id}>
                  {index > 0 && ", "}
                  <span className={short ? "text-warning font-semibold" : ""}>
                    {`${consumable.quantity_per_collection} x ${consumable.item_name}`}
                    {consumable.is_required === false && " (optional)"}
                    {short && ` — only ${consumable.available_quantity} in stock`}
                  </span>
                </span>
              );
            })
          )}
        </div>
      </div>
    )}

    <Accordion 
      key={`process_sample_${sample.id}`} 
      expanded={sample.is_sample_collected ? expanded === sample.id : true} 
      onChange={handleChange(sample.id)} 
      disabled={!sample.is_sample_collected}
    >
      {sample.is_sample_collected && (
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography className='w-full'>
            <div className='flex w-full justify-between'>
              <p className='flex'>{`${sample.specimen_name}`}</p>
              <p className='flex'>{`${sample.patient_sample_code}`}</p>
            </div>
          </Typography>
        </AccordionSummary>
      )}
      <AccordionDetails>
        <Typography>
          <TestPanelsItem collected={sample.is_sample_collected} sample_id={sample.id} sample={sample.patient_sample_code}/>
        </Typography>
      </AccordionDetails>
    </Accordion>
  </div>
)
}

export default SamplesAccordion;
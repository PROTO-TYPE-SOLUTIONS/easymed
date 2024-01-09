import React from 'react'

const DrugsInfo = ({displayNUmber}) => {
    const drugs = [
        {
            name:"Cold Seas",
            quantity:"120 ltrs"
        },
        {
            name:"Ibuprofens",
            quantity:"10 ltrs"
        },
        {
            name:"Paracetamol",
            quantity:"32 pkts"
        },
        {
            name:"Omeprazol",
            quantity:"23 Boxes"
        },
        {
            name:"Bandage",
            quantity:"20 boxes"
        },
        {
            name:"Flagyl",
            quantity:"21 pkts"
        },
        {
            name:"Trenidazole",
            quantity:"12 Pcs"
        },
    ]

    const drugsInfo = drugs.slice(0,displayNUmber).map((item, index)=>{
        return (
            <li key={`dugs-info-${index}`} className='flex justify-between px-4 text-xs my-2 rounded'>
                <p className='w-full'>{item.name}</p>
                <p className='text-end w-full'>{item.quantity}</p>
            </li>
        );

    })
  return (
    <ul>
        {drugsInfo}
    </ul>
  )
}

export default DrugsInfo
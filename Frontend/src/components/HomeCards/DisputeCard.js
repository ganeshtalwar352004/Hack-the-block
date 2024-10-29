import React from 'react'
import DisputeModel from './DisputeCardModel'

const DisputeCard = ({title,buttoText}) => {

  return (
    <>
    <div class='w-96 h-48 p-4 bg-card-gradient flex flex-col justify-center items-center gap-10 rounded-lg  '>

        <h1 class='text-center text-slate-50 text-3xl font-semibold'>Resolve your Dispute</h1>
        {/* <button class="bg-[#B9E5E8] py-2 px-4 text-xl  font-semibold  rounded shadow">
             Post Dispute
        </button> */}
        <DisputeModel/>
    </div>
    </>
  )
}

export default DisputeCard
import React, { useEffect } from 'react'
import JurorCard from '../../components/HomeCards/JurorCard'
import DisputeCard from '../../components/HomeCards/DisputeCard'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const {isConnected,pubKey}=useSelector((state)=>state.address);
    const navigate=useNavigate();
    useEffect(() => {
        if (isConnected) {
          navigate('/disputes');
        }
      }, [isConnected, navigate]);
    // if(isConnected)navigate('./disputes');
  return (
    <div class='w-screen h-screen bg-custom-dark-gradient flex justify-center items-center '>
        <div class='flex gap-16'>
        <DisputeCard/>
        <JurorCard/>
        </div>
    </div>
  )
}

export default Home
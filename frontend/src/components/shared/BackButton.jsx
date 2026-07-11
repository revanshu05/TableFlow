import React from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {

    const navigate = useNavigate();

  return (
    <button 
        onClick={() => navigate(-1)}
        className='bg-[#025cca] p-1 text-xl font-bold rounded-full text-white hover:scale-110'> 
        <IoArrowBackOutline size={22}/>
    </button>
  )
}

export default BackButton
"use client"
import useFetch from '@/app/hooks/useFetch'
import GlobalLoadingPage from '@/app/loading'
import CardStructure1 from '@/components/CardStructure1.tsx'
import { IAssignments } from '@/types'
import React from 'react'

const page = () => {
  const {data,error,loading}=useFetch('user/assignments')

  return (

    <div className="container mx-auto p-4">
      {/* Assignments List */}
      {loading?<GlobalLoadingPage/>
:
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
        {/* Repeat the CardStructure for each assignment */}
        {data.map((card:IAssignments)=><CardStructure1 {...card}/>
       
        )}
      
      </div>
}
    </div>
  
  )
}

export default page



"use client"

import useFetch from '@/app/hooks/useFetch'
import GlobalLoadingPage from '@/app/loading'
import Table from '@/components/Table'
import React from 'react'

const ceritifactions = () => {
  const {data,error,loading}=useFetch('user/certifications')

  return (
<>
{loading?
<GlobalLoadingPage/>:data.length?
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-6xl  felx items-center justify-center m-14 mx-32 ">
          <Table isDisplayCheckbox={true} columns={['name','supervisorName','graduationYear','average']} bodydatatable={data} actionsTable={{
            delete:()=>{}
          }}/>
          </div>:<div>no have item</div>
}
</>



    

      
     


  )
}

export default ceritifactions
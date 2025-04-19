
import React, { useEffect, useState } from 'react'

const useFetch = (partOfUrl:string) => {
    const [responseObject,setResponseObject]= useState({data:[],loading:false,error:''})


    useEffect(() => {
        setResponseObject({...responseObject,loading:true})
        fetch(`/api/${partOfUrl}`,{method:'get',headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
         }
      }) // API call to get supervisors
          .then((res) => res.json())
          .then((data) => {
            console.log(data.result)
            setResponseObject({...responseObject,data:data.result,loading:false})})
          .catch((err) => setResponseObject({...responseObject,error:'happen some problem'}));
      }, []);
    
  return responseObject;
}

export default useFetch;

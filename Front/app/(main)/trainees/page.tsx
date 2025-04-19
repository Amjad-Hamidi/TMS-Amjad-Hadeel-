"use client"
import Image from "next/image";
import GlobalLoadingPage from "@/app/loading";
import SupervisorCard from "@/components/SupervisorCard.tsx";
import useFetch from "@/app/hooks/useFetch";
import { ISupervisor } from "@/types";

const TraineesPage = () => {
const {data,error,loading}=useFetch('user/supervisors')
  return (
    <div className="min-h-screen  p-6 w-full">
      <h2 className="text-xl font-bold text-center  mb-6  ">
        My Trainee
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loading? <GlobalLoadingPage/>: data.map((supervisor) => (<SupervisorCard {...supervisor as ISupervisor }/>
    
))}
      
      </div>
   
    </div>
  );
};

export default TraineesPage;

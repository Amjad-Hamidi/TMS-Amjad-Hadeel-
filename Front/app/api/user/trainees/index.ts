import { ISupervisor } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// Dummy data (Replace this with data from your database)
const supervisors :ISupervisor[]= [{
  profileImage: 'images/people/profile-picture-1.jpeg',
  id: '67f52b776839abb1b451ace1',
  name: "",
  email: "",
  phone: "",
  rate: 5
}];



export const GET =  (request: NextRequest) => {
    return NextResponse.json(
      { result: supervisors },
      { status: 200 }
    );
  }

  
  


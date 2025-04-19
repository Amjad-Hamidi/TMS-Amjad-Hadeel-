import { IAssignments } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// Dummy data (Replace this with data from your database)
const assignments :IAssignments[]= [
  {
    title: "",
    date: "",
    description: "",
    status: "panding"
  },
  {
    title: "",
    date: "",
    description: "",
    status: "panding"
  },{
    title: "",
    date: "",
    description: "",
    status: "panding"
  }
]



export const GET =  (request: NextRequest) => {
    return NextResponse.json(
      { result: assignments },
      { status: 200 }
    );
  }

  


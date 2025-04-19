import { ICours } from "@/types";
import { NextRequest, NextResponse } from "next/server";




// Dummy data (Replace this with data from your database)
var courses :ICours[]= [
  {
    id: '1',
    name:'NextJS development',
    supervisorName: "Dr. Sarah Al-Sharif",
    phone: "056-123-4567",
    rate: 5,
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    status: 'panding'
  },  {
    id: '1',
    supervisorName: "Dr. Sarah Al-Sharif",
    phone: "056-123-4567",
    rate: 5,
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    status: 'panding',
    name:'NextJS development',
  },  {
    id: '1',
    supervisorName: "Dr. Sarah Al-Sharif",
    phone: "056-123-4567",
    rate: 5,
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    status: 'panding',
    name:'NextJS development',
  },  {
    id: '1',
    supervisorName: "Dr. Sarah Al-Sharif",
    phone: "056-123-4567",
    rate: 5,
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    status: 'completed',
    name:'NextJS development',
  }];


export const GET =  (request: NextRequest) => {
    return NextResponse.json(
      { result: courses },
      { status: 200 }
    );
  }

  



import { ICertification, ISupervisor } from "@/types";
import { NextRequest, NextResponse } from "next/server";
const certifications: ICertification[] = [
  {
    id: "1",
    name: "Advanced React Developer Certification",
    supervisorName: "Dr. Sarah Al-Sharif",
    GarductionYear: "2025",
    avarage: "85%"
  },
  {
    id: "2",
    name: "JavaScript Mastery",
    supervisorName: "Mr. Omar Al-Mutairi",
    GarductionYear: "2024",
    avarage: "90%"
  },
  // Add more certification objects as needed
];


export const GET =  (request: NextRequest) => {
    return NextResponse.json(
      { result: certifications },
      { status: 200 }
    );
  }

  
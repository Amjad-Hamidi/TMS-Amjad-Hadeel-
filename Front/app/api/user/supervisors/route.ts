


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";


const JWT_SECRET = process.env.JWT_SECRET as string;



export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    
    const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }  
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const traineeId = decoded.id;
    const targetUser = await User.findOne({ _id: traineeId });



    if (!targetUser) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
  console.log(targetUser.supervisors)
    return NextResponse.json({result:targetUser.supervisors,status:200 });


  } catch (error) {

    return NextResponse.json({ massage:'invaild'}, { status: 500 });
  }
};






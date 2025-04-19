import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        username: user.username,  
        phone: user.phone,
        location: user.location, 
        gender: user.gender, 
        university: user.university, 
        specialization: user.specialization
      }, 
      SECRET_KEY, 
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        role: user.role,
        username: user.username, 
        googlePhotoUrl: user.googlePhotoUrl, 
        phone: user.phone,
        location: user.location, 
        gender: user.gender, 
        university: user.university, 
        specialization: user.specialization 
      }
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

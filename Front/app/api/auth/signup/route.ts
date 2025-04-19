import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      username,
      email,
      password,
      role,
      phone,
      location,
      gender,
      university,
      specialization,
    } = await req.json();

    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const baseData: any = {
      username,
      email,
      password: hashedPassword,
      role,
      phone,
      location,
      gender,
      university,
      specialization,
    };

    if (role === "company") {
      baseData.jobs = [];
      baseData.trainees = [];
      baseData.supervisors = [];
    } else if (role === "supervisor") {
      baseData.trainees = [];
    } else if (role === "trainee") {
      baseData.appliedJobs = [];
    }

    const newUser = new User(baseData);
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}

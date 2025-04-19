import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function PUT(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { profilePicture, username, email, password, phone, location, gender, university, specialization } = await req.json();

    await connectToDB();

    const updateData: any = {
      googlePhotoUrl: profilePicture,  
      username,
      email,
      phone,
      location,
      gender,
      university,
      specialization
    };

    // إذا قام المستخدم بإدخال كلمة مرور جديدة، قم بتشفيرها قبل تخزينها
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(decoded.id, updateData, { new: true });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}

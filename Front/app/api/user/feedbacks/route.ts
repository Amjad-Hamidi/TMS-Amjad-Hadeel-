import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    // Extract the token from request
  const token =
      req.cookies.get("token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    // Get feedback data from request body
    const { supervisorId, feedback ,name,rating} = await req.json();
    // Validate the incoming data
    if (!supervisorId || !feedback) {
      return NextResponse.json(
        { error: "Supervisor ID and feedback are required" },
        { status: 400 }
      );
    }

    // Find the target user (trainee) by traineeId
    const targetUser = await User.findOne({ _id: '67f4de36f0c4f417f71d7523' });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    // Add feedback to the supervisor's feedback array
    const feedbackEntry = {
      id: Date.now(),
      feedback,
      name,
      rating,
      date: new Date(),
    };

    targetUser.feedbacks.push(feedbackEntry);

    // Save the updated targetUser with the new feedback
    await targetUser.save();
    console.log('success')
    return NextResponse.json(
      { message: "Feedback successfully submitted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

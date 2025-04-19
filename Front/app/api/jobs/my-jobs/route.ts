import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Job from '@/models/Job';
import mongoose from 'mongoose';


interface JwtPayload {
  id: string;
  role: string;
}

export async function GET(request: NextRequest) { 
  console.log("--- Handling GET /api/jobs/my-jobs ---");
  try {
    await dbConnect();

    // 1. Authentication
    const authorization = request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    const token = authorization.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return NextResponse.json({ message: 'Server config error.' }, { status: 500 });

    let decoded: JwtPayload;
    try { decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; }
    catch (error) { return NextResponse.json({ message: 'Invalid token.' }, { status: 401 }); }

    // 2. Authorization & Find User
    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) return NextResponse.json({ message: 'Invalid user ID in token.' }, { status: 400 });

    const companyUser = await User.findById(decoded.id);
    if (!companyUser) return NextResponse.json({ message: 'Company user not found.' }, { status: 404 });
    if (companyUser.role !== 'company') return NextResponse.json({ message: 'Forbidden: Only companies can access this.' }, { status: 403 });

    // 3. Fetch Jobs for this Company
    console.log(`Fetching jobs for Company ID: ${companyUser._id}...`);
    const jobs = await Job.find({ company: companyUser._id }) 
                         .sort({ postedDate: -1 }); 

    console.log(`Found ${jobs.length} jobs for company ${companyUser._id}.`);
    return NextResponse.json({ jobs: jobs }, { status: 200 });

  } catch (error: any) {
    console.error("Error in GET /api/jobs/my-jobs:", error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
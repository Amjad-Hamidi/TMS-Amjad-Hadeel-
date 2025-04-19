import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import mongoose from 'mongoose';

interface JwtPayload { id: string; role: string; }

interface TrainingSummaryResponse {
    acceptedJobsAsTrainee?: any[];   
    supervisedJobs?: any[]; 
}

export async function GET(request: NextRequest) {
    console.log("--- Handling GET /api/training/summary ---");
    try {
        await dbConnect();

        // 1. Authentication & Get User Role/ID
        const authorization = request.headers.get('Authorization');
        if (!authorization || !authorization.startsWith('Bearer ')) { return NextResponse.json({ message: 'Auth required.' }, { status: 401 }); }
        const token = authorization.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) { return NextResponse.json({ message: 'Server config error.' }, { status: 500 }); }

        let decoded: JwtPayload;
        try { decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; }
        catch (error) { return NextResponse.json({ message: 'Invalid token.' }, { status: 401 }); }

        if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id) || !decoded.role) { return NextResponse.json({ message: 'Invalid token payload.' }, { status: 400 }); }

        const userId = new mongoose.Types.ObjectId(decoded.id);
        const userRole = decoded.role;

        console.log(`Fetching training summary for User ID: ${userId}, Role: ${userRole}`);

        let summaryData: TrainingSummaryResponse = {};

        // 2. Fetch Data Based on Role

        if (userRole === 'trainee') {
            console.log("Fetching accepted jobs for trainee...");
            summaryData.acceptedJobsAsTrainee = await Job.find({
                acceptedTrainees: userId 
            })
            .populate({ path: 'company', select: 'username googlePhotoUrl' })
            .populate({ path: 'supervisor', select: 'username email phone' }) 
            .select('title company supervisor postedDate location type')
            .sort({ postedDate: -1 })
            .lean();
            console.log(`Found ${summaryData.acceptedJobsAsTrainee?.length || 0} accepted jobs.`);
    
        } else if (userRole === 'supervisor') {
            console.log("Fetching supervised jobs for supervisor...");
            summaryData.supervisedJobs = await Job.find({ supervisor: userId })
                .populate({ path: 'company', select: 'username googlePhotoUrl' })
                .populate({ path: 'acceptedTrainees', select: 'username email phone university specialization _id' }) 
                .select('title company acceptedTrainees postedDate location type isActive') 
                .sort({ postedDate: -1 })
                .lean();
            console.log(`Found ${summaryData.supervisedJobs?.length || 0} supervised jobs.`);
        } else {
            console.log("Role is not trainee or supervisor, returning empty data.");
            summaryData.acceptedJobsAsTrainee = [];
            summaryData.supervisedJobs = [];
        }

        return NextResponse.json(summaryData, { status: 200 });

    } catch (error: any) {
        console.error("Error in GET /api/training/summary:", error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
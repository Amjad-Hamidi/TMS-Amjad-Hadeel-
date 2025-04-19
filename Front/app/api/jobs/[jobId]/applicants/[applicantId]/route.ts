import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User'; 
import Job from '@/models/Job';
import mongoose, { Types } from 'mongoose';

interface JwtPayload { id: string; role: string; }


export async function DELETE(request: NextRequest, context: { params: { jobId: string, applicantId: string } }) {
    const { params } = context;
    let session: mongoose.ClientSession | null = null;
  
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        await dbConnect();
  
        // 1. Validate IDs
        const { jobId, applicantId } = params;
        if (!jobId || !Types.ObjectId.isValid(jobId) || !applicantId || !Types.ObjectId.isValid(applicantId)) {
            if(session) { await session.abortTransaction(); session.endSession(); }
            return NextResponse.json({ message: 'Invalid Job or Applicant ID.' }, { status: 400 });
        }
        console.log(`Validating IDs: Job=${jobId}, Applicant=${applicantId}`);
  
        // 2. Authentication & Authorization (Company)
        const authorization = request.headers.get('Authorization');
        if (!authorization || !authorization.startsWith('Bearer ')) { /* ... error handling ... */ }
        const token = authorization.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) { /* ... error handling ... */ }
        let decoded: JwtPayload;
        try { decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; }
        catch (error) { /* ... error handling ... */ }
        const companyUser = await User.findById(decoded.id).session(session);
        if (!companyUser || companyUser.role !== 'company') { /* ... error handling ... */ }
        console.log("Company user verified:", companyUser.username);
  
        // 3. Find Job & Verify Ownership
        console.log(`Finding and updating job with ID: ${jobId}`);
        const updatedJob = await Job.findOneAndUpdate(
            {
                _id: jobId,
                company: companyUser._id 
            },
            {
                $pull: { applicants: applicantId },
                $inc: { applicationCount: -1 }
            },
            { new: false, session: session } 
        );
  
        if (!updatedJob) {
            const jobExists = await Job.findById(jobId).lean(); 
            if (!jobExists) {
                console.error(`Job ${jobId} not found for rejection.`);
                await session.abortTransaction(); session.endSession();
                return NextResponse.json({ message: 'Job not found.' }, { status: 404 });
            } else {
                console.error(`Ownership mismatch or job ${jobId} already updated.`);
                await session.abortTransaction(); session.endSession();
                return NextResponse.json({ message: 'Forbidden: You do not own this job or it was modified.' }, { status: 403 });
            }
        }
        console.log(`Applicant ${applicantId} removed from job ${jobId}.`);
        const applicantUpdateResult = await User.findByIdAndUpdate(
            applicantId,
            { $pull: { appliedJobs: jobId } },
            { session: session }
        );
         if (!applicantUpdateResult) {
             console.warn(`Could not find or update applicant ${applicantId} to remove applied job.`);
         } else {
             console.log(`Removed job ${jobId} from applicant ${applicantId}'s appliedJobs.`);
         }
  
  
        // 5. Commit transaction
        await session.commitTransaction();
        session.endSession();
        console.log("Rejection transaction committed.");
        return NextResponse.json({ message: 'Applicant rejected successfully.' }, { status: 200 });

  
  
    } catch (error: any) {
        if (session) { /* ... abort logic ... */ }
        console.error("Error rejecting applicant:", error);
        const errorMessage = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message;
        return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
    }
  }

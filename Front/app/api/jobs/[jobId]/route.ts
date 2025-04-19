import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, context: { params: { jobId: string } }) { 
    const { params } = context; 
    try {
        await dbConnect();
        const { jobId } = params; 

        // 1. Validate jobId
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            console.error("Invalid Job ID:", jobId);
            return NextResponse.json({ message: 'Invalid Job ID format.' }, { status: 400 });
        }
        console.log("Fetching job details for ID:", jobId);

        // 2. Determine which fields to populate
        const { searchParams } = new URL(request.url);
        const populateQuery = searchParams.get('populate');
        const fieldsToPopulate = populateQuery ? populateQuery.split(',') : [];
        let pathsToPopulate: mongoose.PopulateOptions[] = [];

        console.log("Requested populations:", fieldsToPopulate);

        const requiredPopulates = ['company', 'applicants', 'acceptedApplicants']; 
        const selectFields = {
            company: 'username googlePhotoUrl email',
            applicants: 'username email googlePhotoUrl university specialization _id phone role',
            acceptedApplicants: 'username email googlePhotoUrl _id phone role'
        };

        requiredPopulates.forEach(field => {
            if (fieldsToPopulate.includes(field) || fieldsToPopulate.length === 0) {
                 if (Job.schema.path(field)) {
                     pathsToPopulate.push({
                         path: field,
                         select: selectFields[field] || '' 
                     });
                 } else {
                     console.warn(`Attempted to populate non-existent path: ${field}`);
                 }
            }
        });


        console.log("Final populate options:", pathsToPopulate);
        // 3. Find the job and populate
        let query = Job.findById(jobId);
        if (pathsToPopulate.length > 0) {
            try {
                 query = query.populate(pathsToPopulate);
            } catch (populateError) {
                 console.error("Error during query.populate():", populateError);
                 throw populateError; 
            }
        }
        const job = await query.exec();

        // 4. Check if job was found
        if (!job) {
            console.log("Job not found for ID:", jobId);
            return NextResponse.json({ message: 'Job not found.' }, { status: 404 });
        }

        // 5. Ensure arrays are initialized
        const jobData = job.toObject({ virtuals: true });
        jobData.applicants = jobData.applicants || [];
        jobData.acceptedApplicants = jobData.acceptedApplicants || [];

        // 6. Return the job data
        return NextResponse.json({ job: jobData }, { status: 200 });

    } catch (error: any) {
        console.error(`Error in GET /api/jobs/[jobId]:`, error);
        const errorMessage = error.message || 'An unexpected error occurred while fetching job details.';
        const errorDetails = process.env.NODE_ENV !== 'production' ? error.stack : undefined;
        return NextResponse.json({ message: 'Internal Server Error', error: errorMessage, details: errorDetails }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User'; 
import Job from '@/models/Job';
import mongoose, { Types } from 'mongoose';

interface JwtPayload { id: string; role: string; }

export async function PUT(request: NextRequest, { params }: { params: { jobId: string, applicantId: string } }) {
  let session: mongoose.ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    await dbConnect();

    // 1. Validate IDs
    const { jobId, applicantId } = params;
    if (!jobId || !Types.ObjectId.isValid(jobId) || !applicantId || !Types.ObjectId.isValid(applicantId)) {
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Invalid Job or Applicant ID provided.' }, { status: 400 });
     }

    // 2. Authentication & Authorization (Company)
    const authorization = request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
        console.error("Authentication failed: Missing or invalid header.");
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }
    const token = authorization.split(' ')[1];

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error("CRITICAL: JWT_SECRET environment variable is not defined!");
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        console.log("Token decoded:", decoded);
    } catch (error) {
        console.error("Token verification failed:", error);
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    // 3. Find Company User (within transaction) and Authorize
    const companyUser = await User.findById(decoded.id).session(session).select('+trainees +supervisors');
    if (!companyUser) {
        console.error(`Company user with ID ${decoded.id} not found.`);
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Company user performing action not found.' }, { status: 404 });
    }
    if (companyUser.role !== 'company') {
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Forbidden: Action requires company role.' }, { status: 403 });
    }

    // 4. Find Job (within transaction) & Verify Ownership
    const job = await Job.findById(jobId).session(session);
    if (!job) {
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Job not found.' }, { status: 404 });
    }
    if (job.company.toString() !== companyUser._id.toString()) {
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Forbidden: You do not own this job.' }, { status: 403 });
    }

    // 5. Find Applicant (within transaction)
    const applicant = await User.findById(applicantId).session(session).select('+role'); 
    if (!applicant) {
        if(session) { await session.abortTransaction(); session.endSession(); }
        return NextResponse.json({ message: 'Applicant user not found.' }, { status: 404 });
    }

        let successMessage = "";
        let updateCompany = false;

        if (applicant.role === 'supervisor') {
            if (job.supervisor) {
                if (job.supervisor.toString() === applicant._id.toString()) {
                     await session.abortTransaction(); session.endSession();
                     return NextResponse.json({ message: 'This supervisor is already assigned to this job.' }, { status: 400 });
                } else {
                     await session.abortTransaction(); session.endSession();
                    return NextResponse.json({ message: 'Another supervisor is already assigned to this job.' }, { status: 400 });
                }
            }
            job.supervisor = applicant._id;
            console.log(`Assigned supervisor ${applicant.username} to job ${jobId}.`);
            successMessage = `Supervisor ${applicant.username} assigned to job successfully!`;
            companyUser.supervisors = companyUser.supervisors || [];
            if (!companyUser.supervisors.some(sId => sId.equals(applicant._id))) {
                companyUser.supervisors.push(applicant._id);
                 updateCompany = true;
                 console.log(`Added ${applicant.username} to company's supervisors list.`);
            }

        } else if (applicant.role === 'trainee') {
            const alreadyAccepted = job.acceptedTrainees?.some(accId => accId.toString() === applicant._id.toString());
            if (alreadyAccepted) {
                await session.abortTransaction(); session.endSession();
                return NextResponse.json({ message: 'This trainee is already accepted for this job.' }, { status: 400 });
            }
            job.acceptedTrainees = job.acceptedTrainees || [];
            job.acceptedTrainees.push(applicant._id);
            console.log(`Accepted trainee ${applicant.username} for job ${jobId}.`);
            successMessage = `Trainee ${applicant.username} accepted successfully!`;

            companyUser.trainees = companyUser.trainees || [];
            if (!companyUser.trainees.some(tId => tId.equals(applicant._id))) {
                companyUser.trainees.push(applicant._id);
                 updateCompany = true;
                 console.log(`Added ${applicant.username} to company's trainees list.`);
             }
        } else {
            await session.abortTransaction(); session.endSession();
            return NextResponse.json({ message: `Cannot accept user with role: ${applicant.role}` }, { status: 400 });
        }

    // 6. Check if applied (Optional but good practice)
    const didApply = job.applicants?.some(appId => appId.toString() === applicant._id.toString());
    if (!didApply && job.applicants?.length > 0) { 
        await session.abortTransaction(); session.endSession();
        return NextResponse.json({ message: 'This user did not apply for this job.' }, { status: 400 });
    }

    // 7. Check if already accepted in THIS job
    const alreadyAccepted = job.acceptedApplicants?.some(accId => accId.toString() === applicant._id.toString());
    if (alreadyAccepted) {
        await session.abortTransaction(); session.endSession();
        return NextResponse.json({ message: 'This applicant is already accepted for this job.' }, { status: 400 });
    }

    // 8. Update Job: Add to acceptedApplicants array
    job.acceptedApplicants = job.acceptedApplicants || [];
    job.acceptedApplicants.push(applicant._id);

    // 9. Update Company: Add to trainees/supervisors list if not already present
    if (applicant.role === 'trainee') {
        companyUser.trainees = companyUser.trainees || [];
        if (!companyUser.trainees.some(tId => tId.equals(applicant._id))) {
            companyUser.trainees.push(applicant._id);
            updateCompany = true;
        } else { console.log(`Applicant ${applicant.username} already in company's trainees.`); }
    } else if (applicant.role === 'supervisor') {
        companyUser.supervisors = companyUser.supervisors || [];
        if (!companyUser.supervisors.some(sId => sId.equals(applicant._id))) {
            companyUser.supervisors.push(applicant._id);
            updateCompany = true;
        } else { console.log(`Applicant ${applicant.username} already in company's supervisors.`); }
    } 

    // 10. Save changes within transaction
    await job.save({ session });

    if (updateCompany) {
        await companyUser.save({ session });
    } 
    await session.commitTransaction();
    session.endSession(); 

    // 11. Success Response
    return NextResponse.json({ message: `Applicant ${applicant.username} accepted successfully!` }, { status: 200 });

  } catch (error: any) {
    if (session) {
        try {
            await session.abortTransaction();
            session.endSession();
        } catch (abortError) {
             if(!session.hasEnded) session.endSession();
        }
    }

    const errorMessage = error.message || 'An unexpected error occurred.';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}

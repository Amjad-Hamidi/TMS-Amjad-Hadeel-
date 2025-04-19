// app/api/jobs/[jobId]/status/route.ts (ملف جديد)
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Job from '@/models/Job';
import mongoose, { Types } from 'mongoose';

interface JwtPayload { id: string; role: string; }

// نستخدم PUT لتحديث حالة الوظيفة
export async function PUT(request: NextRequest, { params }: { params: { jobId: string } }) {
    console.log(`--- PUT /api/jobs/${params.jobId}/status ---`);
    try {
        await dbConnect();
        const { jobId } = params;
        if (!jobId || !Types.ObjectId.isValid(jobId)) { return NextResponse.json({ message: 'Invalid Job ID.' }, { status: 400 }); }

        // Authentication & Authorization (Company)
        const authorization = request.headers.get('Authorization');
        if (!authorization || !authorization.startsWith('Bearer ')) return NextResponse.json({ message: 'Auth required.' }, { status: 401 });
        const token = authorization.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) return NextResponse.json({ message: 'Server config error.' }, { status: 500 });
        let decoded: JwtPayload;
        try { decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; }
        catch (error) { return NextResponse.json({ message: 'Invalid token.' }, { status: 401 }); }
        const companyUser = await User.findById(decoded.id);
        if (!companyUser || companyUser.role !== 'company') return NextResponse.json({ message: 'Forbidden: Company role required.' }, { status: 403 });

        // Find Job & Verify Ownership
        const job = await Job.findById(jobId);
        if (!job) return NextResponse.json({ message: 'Job not found.' }, { status: 404 });
        if (job.company.toString() !== companyUser._id.toString()) return NextResponse.json({ message: 'Forbidden: You do not own this job.' }, { status: 403 });

        // Toggle isActive status
        job.isActive = !job.isActive;
        await job.save();

        const statusMessage = job.isActive ? 'Job status set to Active.' : 'Job status set to Inactive.';
        console.log(statusMessage, "Job ID:", jobId);
        return NextResponse.json({ message: statusMessage, jobStatus: job.isActive }, { status: 200 });

    } catch (error: any) {
        console.error("Error toggling job status:", error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
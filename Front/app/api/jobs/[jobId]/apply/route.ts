import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb'; 
import User from '@/models/User';
import Job from '@/models/Job';
import { Types } from 'mongoose';

interface JwtPayload {
  id: string;
  role: string;
}

export async function POST(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    await dbConnect();

    // 1. التحقق من وجود jobId
    const { jobId } = params;
    if (!jobId || !Types.ObjectId.isValid(jobId)) {
      return NextResponse.json({ message: 'Invalid Job ID.' }, { status: 400 });
    }

    // 2. التحقق من التوثيق (Authentication)
    const authorization = request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }
    const token = authorization.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined.");
      return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    // 3. إيجاد المستخدم (المتقدم)
    const applicant = await User.findById(decoded.id).select('+role +appliedJobs'); 
    if (!applicant) {
      return NextResponse.json({ message: 'Applicant user not found.' }, { status: 404 });
    }

    // 4. التحقق من الصلاحية (Authorization)
    if (applicant.role !== 'trainee' && applicant.role !== 'supervisor') {
      return NextResponse.json({ message: 'Forbidden: Only trainees or supervisors can apply.' }, { status: 403 });
    }

    // 5. إيجاد الوظيفة
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: 'Job not found.' }, { status: 404 });
    }
    if (!job.isActive) {
         return NextResponse.json({ message: 'Cannot apply to an inactive job.' }, { status: 400 });
    }


    // 6. التحقق مما إذا كان قد تم التقديم بالفعل
    const alreadyAppliedJob = job.applicants?.some(applicantId => applicantId.equals(applicant._id));
    const alreadyAppliedUser = applicant.appliedJobs?.some(appliedJobId => appliedJobId.equals(job._id));

    if (alreadyAppliedJob || alreadyAppliedUser) {
      return NextResponse.json({ message: 'You have already applied for this job.' }, { status: 400 });
    }

    // 7. تحديث مستند الوظيفة
    job.applicants = job.applicants || [];
    job.applicants.push(applicant._id);
    job.applicationCount = (job.applicationCount || 0) + 1;

    // 8. تحديث مستند المستخدم
    applicant.appliedJobs = applicant.appliedJobs || [];
    applicant.appliedJobs.push(job._id);

    // 9. حفظ التغييرات (من الأفضل استخدام transaction هنا للضمان، لكن هذا أبسط)
    await job.save();
    await applicant.save();

    // 10. إرسال استجابة نجاح
    return NextResponse.json({ message: 'Applied successfully!' }, { status: 200 });

  } catch (error: any) {
    console.error("Error in POST /api/jobs/[jobId]/apply:", error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
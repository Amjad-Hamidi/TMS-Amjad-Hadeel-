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
interface DashboardSummaryResponse {
    stats?: {
        // Company
        totalJobs?: number;
        activeJobs?: number;
        totalApplicants?: number;
        totalAccepted?: number;
        assignedTrainees?: number;
        assignedSupervisors?: number;
        // Trainee
        appliedJobs?: number;
        acceptedOffers?: number;
        ongoingCourses?: number;
        pendingAssignments?: number;
        certifications?: number;
        // Supervisor
        supervisedJobsCount?: number;        
        activeSupervisedJobsCount?: number; 
        totalSupervisedTrainees?: number;   
        totalApplicantsToJobs?: number;      
        directlyAssignedTrainees?: number;  
        // Admin
        totalUsers?: number;
        totalCompanies?: number;
        totalSupervisors?: number;
        totalTrainees?: number;
        totalActiveJobs?: number;
        [key: string]: number | string | undefined; 
    };
    recentJobs?: any[];
    recentAcceptedTrainees?: {
        _id: string;
        username: string;
        jobTitle: string;
        jobId: string;
        acceptedDate: Date | string;
    }[];
    assignedTrainees?: any[]; 
    recentApplications?: any[];
}

export async function GET(request: NextRequest) {
    console.log("--- Handling GET /api/dashboard/summary ---");
    try {
        await dbConnect();
        console.log("Database connected successfully.");

        // 1. Authentication
        const authorization = request.headers.get('Authorization');
        if (!authorization || !authorization.startsWith('Bearer ')) {
            console.warn("Authentication failed: Missing or invalid Authorization header.");
            return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
        }
        const token = authorization.split(' ')[1];

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET environment variable is not defined!");
            return NextResponse.json({ message: 'Server configuration error: JWT secret missing.' }, { status: 500 });
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            console.log("Token verified. Payload:", decoded);
        } catch (error) {
            console.error("Token verification failed:", error);
            return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
        }

        // 2. Find User and Validate ID/Role
        if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id) || !decoded.role) {
            console.error("Invalid token payload:", decoded);
            return NextResponse.json({ message: 'Invalid token payload.' }, { status: 400 });
        }
        const userId = new mongoose.Types.ObjectId(decoded.id);
        const userRole = decoded.role;

        console.log(`Fetching summary for User ID: ${userId}, Role: ${userRole}`);
        const currentUser = await User.findById(userId).lean(); 
        if (!currentUser) {
            console.error(`User with ID ${userId} not found.`);
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

   
        let summaryData: DashboardSummaryResponse = { stats: {} };


        // === (Company) ===
        if (userRole === 'company') {
            console.log("Fetching Company dashboard data...");
            const [jobStatsResult, recentJobsResult, staff] = await Promise.all([
                Job.aggregate([
                    { $match: { company: userId } },
                    {
                        $group: {
                            _id: null,
                            totalJobs: { $sum: 1 },
                            activeJobs: { $sum: { $cond: ["$isActive", 1, 0] } },
                            totalApplicants: { $sum: { $size: { $ifNull: ["$applicants", []] } } },
                            totalAccepted: { $sum: { $size: { $ifNull: ["$acceptedTrainees", []] } } } 
                        }
                    }
                ]).exec(),
                Job.find({ company: userId })
                   .sort({ postedDate: -1 })
                   .limit(5)
                   .select('title isActive applicants acceptedTrainees postedDate') 
                   .lean(),
                User.findById(userId).select('trainees supervisors').lean()
            ]);

            const jobStats = jobStatsResult[0] || {};

            summaryData.stats = {
                postedJobs: jobStats.totalJobs || 0,
                activeJobs: jobStats.activeJobs || 0,
                totalApplicants: jobStats.totalApplicants || 0,
                totalAccepted: jobStats.totalAccepted || 0, 
                assignedTrainees: staff?.trainees?.length || 0,
                assignedSupervisors: staff?.supervisors?.length || 0,
            };
            summaryData.recentJobs = recentJobsResult.map(job => ({
                _id: job._id.toString(),
                title: job.title,
                isActive: job.isActive,
                applicantsCount: job.applicants?.length || 0,
                acceptedCount: job.acceptedTrainees?.length || 0, 
                postedDate: job.postedDate
            }));
            console.log("Company summary stats:", summaryData.stats);

        // === (Trainee) ===
        } else if (userRole === 'trainee') {
            console.log("Fetching Trainee dashboard data...");
            const [appliedJobsCountResult, acceptedInActiveJobsCount] = await Promise.all([
                 User.aggregate([
                     { $match: { _id: userId } },
                     { $project: { _id: 0, count: { $size: { $ifNull: ["$appliedJobs", []] } } } }
                 ]).exec(),
                 Job.countDocuments({
                     acceptedTrainees: userId, 
                     isActive: true
                 }).exec()
            ]);

            summaryData.stats = {
                 appliedJobs: appliedJobsCountResult[0]?.count || 0,
                 acceptedOffers: acceptedInActiveJobsCount || 0,          
                 ongoingCourses: 0, 
                 pendingAssignments: 0, 
                 certifications: 0, 
            };
            console.log("Trainee summary stats:", summaryData.stats);


        // === (Supervisor) ===
        } else if (userRole === 'supervisor') {
            console.log("Fetching Supervisor dashboard data (with recent trainees)...");
            const [jobStatsResult, supervisorDetails, recentAccepted] = await Promise.all([
                Job.aggregate([
                    { $match: { supervisor: userId } },
                    {
                        $group: {
                            _id: null,
                            supervisedJobsCount: { $sum: 1 },
                            activeSupervisedJobsCount: { $sum: { $cond: ["$isActive", 1, 0] } },
                            totalApplicantsInJobs: { $sum: { $size: { $ifNull: ["$applicants", []] } } },
                            totalAcceptedTraineesInJobs: { $sum: { $size: { $ifNull: ["$acceptedTrainees", []] } } } 
                        }
                    }
                ]).exec(),
                User.findById(userId).select('trainees').populate<{ trainees: any[] }>({
                    path: 'trainees',
                    select: 'username email _id'
                }).lean(),
                Job.aggregate([
                    { $match: { supervisor: userId } },
                    { $match: { acceptedTrainees: { $exists: true, $ne: [] } } }, 
                    { $unwind: "$acceptedTrainees" },
                    { $sort: { postedDate: -1 } },
                    { $limit: 5 },
                    { $lookup: { from: "users", localField: "acceptedTrainees", foreignField: "_id", as: "traineeInfo" } },
                    { $unwind: "$traineeInfo" },
                    {
                        $project: {
                            _id: "$traineeInfo._id",
                            username: "$traineeInfo.username",
                            jobTitle: "$title",
                            jobId: "$_id",
                            acceptedDate: "$postedDate" 
                        }
                    }
                ]).exec()
            ]);

            const jobStats = jobStatsResult[0] || {};
            const directlyAssignedTraineesCount = supervisorDetails?.trainees?.length || 0;

            summaryData.stats = {
                supervisedJobsCount: jobStats.supervisedJobsCount || 0,
                activeSupervisedJobsCount: jobStats.activeSupervisedJobsCount || 0,
                totalSupervisedTrainees: jobStats.totalAcceptedTraineesInJobs || 0,
                totalApplicantsToJobs: jobStats.totalApplicantsInJobs || 0,     
                directlyAssignedTrainees: directlyAssignedTraineesCount,
            };
            summaryData.assignedTrainees = supervisorDetails?.trainees || [];
            summaryData.recentAcceptedTrainees = recentAccepted;
            summaryData.supervisorTraineeChart = [5, 8, 6, 10, 9, 12, 11];

            console.log("Supervisor summary stats & recent accepted:", summaryData);

        // === (Admin) ===
        } else if (userRole === 'admin') {
            console.log("Fetching Admin dashboard data...");
            const [userCountsResult, jobCountsResult] = await Promise.all([
                User.aggregate([ { $group: { _id: "$role", count: { $sum: 1 } } }, { $group: { _id: null, roles: { $push: { role: "$_id", count: "$count" } }, totalUsers: { $sum: "$count" } } } ]),
                Job.aggregate([ { $group: { _id: null, totalJobs: { $sum: 1 }, activeJobs: { $sum: { $cond: ["$isActive", 1, 0] } } } } ])
            ]);

             const userCounts = userCountsResult[0] || { roles: [], totalUsers: 0 };
             const jobCounts = jobCountsResult[0] || { totalJobs: 0, activeJobs: 0 };

             const rolesStats = userCounts.roles.reduce((acc, item) => {
                 acc[item.role === 'company' ? 'totalCompanies' : item.role === 'supervisor' ? 'totalSupervisors' : item.role === 'trainee' ? 'totalTrainees' : item.role + 's'] = item.count;
                 return acc;
             }, {} as { [key: string]: number });

             summaryData.stats = {
                totalUsers: userCounts.totalUsers || 0,
                totalJobs: jobCounts.totalJobs || 0,
                totalActiveJobs: jobCounts.activeJobs || 0, 
                ...rolesStats,
            };
             console.log("Admin summary stats:", summaryData.stats);

        } else {
            console.warn(`Dashboard summary not implemented for role: ${userRole}`);
            summaryData.stats = { message: `No dashboard summary for role: ${userRole}` };
        }

        console.log("Returning summary data.");
        return NextResponse.json(summaryData, { status: 200 });

    } catch (error: any) {
        console.error("Error in GET /api/dashboard/summary:", error);
        const errorMessage = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message;
        return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
    }
}
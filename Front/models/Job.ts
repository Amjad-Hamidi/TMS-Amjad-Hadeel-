import mongoose, { Schema, Document, Types } from "mongoose";
import type { IUser } from '@/models/User'; 

export interface IJob extends Document {
  title: string;
  description: string;
  extendedDescription?: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  company: Types.ObjectId;
  applicants?: Types.ObjectId[] | IUser[]; 
  supervisor?: Types.ObjectId | IUser | null; 
  acceptedTrainees?: Types.ObjectId[] | IUser[]; 
  acceptedApplicants?: Types.ObjectId[] | IUser[];
  postedDate: Date;
  location?: string;
  isActive: boolean;
  featured?: boolean;
  type?: string;
  experience?: string;
  salary?: string;
  deadline?: Date;
  startDate?: string;
  applicationCount?: number;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  extendedDescription: { type: String },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  benefits: [{ type: String }],
  company: { type: Schema.Types.ObjectId, ref: "User", required: true },
  applicants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  supervisor: { type: Schema.Types.ObjectId, ref: "User", default: null },
  acceptedTrainees: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], 
  acceptedApplicants: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], 
  location: { type: String },
  postedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  type: { type: String },
  experience: { type: String },
  salary: { type: String },
  deadline: { type: Date },
  startDate: { type: String },
  applicationCount: { type: Number, default: 0 },
}, {
  timestamps: false
});

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
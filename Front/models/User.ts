import mongoose, { Schema, Document, Types } from "mongoose";
const SupervisorSchema = new mongoose.Schema({
  id: { type: String, default: 0 },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  rate: { type: Number, default: 0 },
});
const feedbackSchema=new mongoose.Schema({
  name: { type: String, default: "" },
  feedback:{type:String,default:''},
  rating:{type:Number,default:0},
  date:{type:String,default:''},

});

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  googlePhotoUrl: string;
  role: string;
  phone?: string;
  location?: string;
  gender?: string;
  university?: string;
  specialization?: string;
  createdAt: Date;

  // Role-based fields
  jobs?: Types.ObjectId[]; // For company
  trainees?: Types.ObjectId[]; // For company or supervisor
  supervisors?: Types.Array<typeof SupervisorSchema>; // For company
  appliedJobs?: Types.ObjectId[]; // For trainee
  feedbacks?:Types.Array<typeof feedbackSchema >
  acceptedJobs?: Types.ObjectId[]
}


const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googlePhotoUrl: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  },
  role: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  gender: { type: String },
  university: { type: String },
  specialization: { type: String },
  createdAt: { type: Date, default: Date.now },

  // Role-based relations
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }], // if company
  trainees: [{ type: Schema.Types.ObjectId, ref: "User" }], // if company or supervisor
  supervisors: [SupervisorSchema], // if company
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }], // if trainee
  feedbacks:[feedbackSchema],
acceptedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }]
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

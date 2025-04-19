import mongoose, { Schema, model, models } from "mongoose";

const adminSchema = new Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  profileImage: String,
  courses: [
    {
      id: String,
      name: String,
      supervisorName: String,
      dateStart: String,
      dateEnd: String,
      state: String,
    },
  ],
  certifications: [
    {
      id: String,
      name: String,
      supervisorName: String,
      graduationYear: String,
      average: String,
    }
    
  ],
users:[{
    id:String,
    name:String,
    type:String,
    phone:String
}]
});

const Trainee = models.Admin || model("Admin", adminSchema);
export default Trainee;

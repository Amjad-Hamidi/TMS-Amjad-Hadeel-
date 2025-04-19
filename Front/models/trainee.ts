import mongoose, { Schema, model, models } from "mongoose";

const traineeSchema = new Schema({
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
    },
  ],
});

const Trainee = models.Trainee || model("Trainee", traineeSchema);
export default Trainee;

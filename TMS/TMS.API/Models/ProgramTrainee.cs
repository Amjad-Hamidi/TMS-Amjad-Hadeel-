namespace TMS.API.Models
{
    public class ProgramTrainee
    {
        // By Convention, P.K is the name of the class + Id
        // By Convention, F.K is the name of the class + Id
        public int TraineeId { get; set; }
        public UserAccount Trainee { get; set; }
        public int TrainingProgramId { get; set; }
        public TrainingProgram TrainingProgram { get; set; }

        // true = Enrolled, false = Not Enrolled
        public bool Status { get; set; } // true = متواصل, false = منقطع
        public DateTime EnrolledAt { get; set; } = DateTime.Now; // Status = true تاريخ التسجيل في حال كانت 
    }
}

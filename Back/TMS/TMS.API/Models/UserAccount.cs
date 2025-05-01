using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TMS.API.Models
{
    public enum UserRole // اسهل وافضل للقراءة string الى OnModelCreating بتبلش من 0 لاخر عنصر, لكن انا رح احولها في int على شكل DB السلوك الافتراضي الها تتخزن في C# في 
    {
        Company, // = 0 (in Tooltip in C#) but in DB it will be "Company" because i convert the default value (int) of enum to string
        Supervisor, // = 1 in Tooltip in C#, "Supervisor" in DB
        Trainee // = 2 in Tooltip in C#, "Trainee" in DB
    }

    public class UserAccount
    {
        public int Id { get; set; }
        [JsonIgnore]
        public string ApplicationUserId { get; set; } // FK to ApplicationUser table
        [JsonIgnore]
        public ApplicationUser ApplicationUser { get; set; } // Navigation Property to ApplicationUser table

        public UserRole Role { get; set; } // Add, Update in TrainingProgramsController وبتفيدني في IdentityUser مش موجودة في 



        // every Company can create many Training Programs
        public ICollection<TrainingProgram> CreatedPrograms { get; set; } = new List<TrainingProgram>();

        // every Supervisor can supervise many Training Programs
        public ICollection<TrainingProgram> SupervisedPrograms { get; set; } = new List<TrainingProgram>();

        // every Trainee can enroll in many Training Programs
        public ICollection<ProgramTrainee> EnrolledPrograms { get; set; } = new List<ProgramTrainee>();


        // اله هي الايميل value فقط , الي ال UserName هو ان ترجع IdentityUser في ToString السلوك الافتراضي ل
        /*
        public override string ToString()
        {
            return $"ID: {Id}, Email: {Email}, FirstName: {FirstName}, LastName: {LastName}, Phone: {PhoneNumber}";
        }
        */
    }
}

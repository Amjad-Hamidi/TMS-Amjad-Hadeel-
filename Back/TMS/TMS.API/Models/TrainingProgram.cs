using System;
using System.ComponentModel.DataAnnotations;

namespace TMS.API.Models
{
    public class TrainingProgram
    {
        public int TrainingProgramId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TimeSpan Duration { get; set; } // تم تغييره إلى TimeSpan
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }
        // true = Active, false = Inactive
        public bool Status { get; set; }
        public string ImagePath { get; set; }
        public int SeatsAvailable { get; set; }
        public decimal Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now; // تاريخ الانشاء


        // Navigation Properties
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        // every Training Program has made by one Company
        public int CompanyId { get; set; }
        public UserAccount Company { get; set; } // كل برنامج تدريبي له شركة واحدة

        // every Training Program has one Supervisor
        public int? SupervisorId { get; set; } // nullable int عشان يمكن ما يكون في مشرف
        public UserAccount Supervisor { get; set; } // كل برنامج تدريبي له مشرف واحد

        // every Training Program has many Trainees
        public ICollection<ProgramTrainee> ProgramTrainees { get; set; } = new List<ProgramTrainee>();

    }
}

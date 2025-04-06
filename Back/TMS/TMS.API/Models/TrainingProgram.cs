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
        
    }
}

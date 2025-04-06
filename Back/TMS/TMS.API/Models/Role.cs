namespace TMS.API.Models
{
    public static class Role // static : لان الادوار ثابتة ولا تحتاج لانشاء اوبجكت منها
    {
        public const string Admin = "Admin"; // const : Identity لان القيمة ثابتة وتستخدم كنصوص في ال 
        public const string Trainee = "Trainee";
        public const string Supervisor = "Supervisor";
        public const string Company = "Company";
    }
}

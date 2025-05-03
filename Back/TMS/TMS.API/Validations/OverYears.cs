using System.ComponentModel.DataAnnotations;

namespace TMS.API.Validations
{
    public class OverYears(int years) : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if(value == null)
                return true; // 16 اذا ما دخل يكمل عادي لكن اذا دخل لازم يكون اكبر من ال UpdateUserDto يعتبر صحيح إذا كانت القيمة فارغة , تفيد في ال 

            if (value is DateTime data)
            {
                if (DateTime.Now.Year - data.Year > years)
                    return true;
            }
            return false;
        }
        public override string FormatErrorMessage(string name)
        {
            return $"{name} must be over {years} years old.";
        }
    }
}

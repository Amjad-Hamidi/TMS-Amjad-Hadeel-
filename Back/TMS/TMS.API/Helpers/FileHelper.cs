namespace TMS.API.Helpers
{
    public class FileHelper
    {
        public static async Task<string> SaveFileAync(IFormFile file, HttpContext? httpContext = null, string folderName = "images")
        {
            if (file == null || file.Length == 0) return null;

            // توليد اسم ملف فريد
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);

            // تحديد مسار المجلد الذي سيتم تخزين الملف فيه
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", folderName);
            // تحديد المسار الفعلي للتخزين
            var filePath = Path.Combine(folderPath, fileName);

            // يتأكد من وجود المجلد
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!); // معناها المسار كامل باستثناء اسم الملف نفسه رح ينشئه لو مش موجود : GetDirectoryName(filePath)!
                                                                         // فقط عشان نتجنب رسالة الكومبايلر التحذيرية not null تاكيد للكومبايلر انو القيمة : !

            // نسخ الملف فعليًا للسيرفر
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // بناء الرابط الكامل
            string baseUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";
            return $"{baseUrl}/{folderName}/{fileName}";
        }
    }
}

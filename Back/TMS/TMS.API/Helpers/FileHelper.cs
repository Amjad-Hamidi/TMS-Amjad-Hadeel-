namespace TMS.API.Helpers
{
    public class FileHelper
    {
        private static readonly string WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        public static async Task<string> SaveFileAync(IFormFile file, HttpContext? httpContext = null, string folderName = "images")
        {
            if (file == null || file.Length == 0) return null;

            // توليد اسم ملف فريد
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName); // OR:  Guid.NewGuid().ToString() + Path.GetFileName(file.FileName);

            // تحديد مسار المجلد الذي سيتم تخزين الملف فيه
            var folderPath = Path.Combine(WebRootPath, folderName);
            // تحديد المسار الفعلي للتخزين
            var filePath = Path.Combine(folderPath, fileName);

            // يتأكد من وجود المجلد
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!); // معناها المسار كامل باستثناء اسم الملف نفسه رح ينشئه لو مش موجود : GetDirectoryName(filePath)!
                                                                         // فقط عشان نتجنب رسالة الكومبايلر التحذيرية not null تاكيد للكومبايلر انو القيمة : !

            // نسخ الملف فعليًا للسيرفر
            using (var stream = new FileStream(filePath, FileMode.Create)) // OR: using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            // بناء الرابط الكامل
            string baseUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";
            return $"{baseUrl}/{folderName}/{fileName}"; 
        }


        // 🧹 حذف ملف بناءً على رابط URL
        public static void DeleteFileFromUrl(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;

            try
            {
                if (!Uri.IsWellFormedUriString(fileUrl, UriKind.Absolute)) return;

                var relativePath = new Uri(fileUrl).AbsolutePath.TrimStart('/');
                var path = Path.Combine(
                    WebRootPath,
                    relativePath.Replace("/", Path.DirectorySeparatorChar.ToString()));

                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception ex)
            {
                // ممكن تسجل الخطأ لو حبيت
                Console.WriteLine($"[File Delete Error]: {ex.Message}");
            }
        }

    }
}

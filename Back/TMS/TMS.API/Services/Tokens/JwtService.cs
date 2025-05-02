using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TMS.API.Data;
using TMS.API.Models;
using TMS.API.Models.AuthenticationModels;

namespace TMS.API.Services.Tokens
{
    public class JwtService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration configuration;
        private readonly SignInManager<ApplicationUser> signInManager;

        public TMSDbContext dbContext { get; }

        public JwtService(UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            TMSDbContext dbContext,
            SignInManager<ApplicationUser> signInManager)
        {
            this.userManager = userManager;
            this.configuration = configuration;
            this.dbContext = dbContext;
            this.signInManager = signInManager;
        }

        public async Task<LoginResponseModel?> Authenticate(LoginRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return null;

            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
                return null;

            // استخدم SignInManager
            var signInResult = await signInManager.PasswordSignInAsync(user.UserName,
                request.Password,
                request.RememberMe,
                lockoutOnFailure: false);

            if (signInResult.IsLockedOut)
                throw new InvalidOperationException("Your account is locked out, please try again later.");

            else if (signInResult.IsNotAllowed)
                throw new InvalidOperationException("Email not confirmed, please confirm your email before logging in.");

            else if (signInResult.RequiresTwoFactor)
                throw new InvalidOperationException("Two-factor authentication is required.");

            else if (!signInResult.Succeeded)
                return null;

            var roles = await userManager.GetRolesAsync(user); // GetRolesAsync() : IList<string> دايما بترجع 
            var role = roles.FirstOrDefault();

            var accessToken = GenerateJwtToken(user, role); // توليد Access Token
            var refreshToken = GenerateRefreshToken(); // توليد Refresh Token

            // (حدوث سلوك غير متوقع فقط بصير) DB تم توليدها بشكل صحيح قبل تحديث بيانات اليوزر في Refresh Token  و Access Token  فحص اضافي احتياطي للتاكد من ال
            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
                return null;

            // وتحديد صلاحياتها Refresh Token تحديث بيانات المستخدم بالـ 
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // تحديد فترة صلاحية Refresh Token ل 7 ايام
            await userManager.UpdateAsync(user); // DB لهاد اليوزر في ال Refresh Token تحديث ال

            // ApplicationUserId من خلال UserAccountId استرجاع ال
            var userAccount = dbContext.UserAccounts
                .AsNoTracking()
                .FirstOrDefault(u => u.ApplicationUserId == user.Id);
            var userAccountId = userAccount?.Id ?? 0;

            return new LoginResponseModel
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                UserName = user.UserName!,
                Role = role,
                UserAccountId = userAccountId, // ✅ UserAccountId
                ExpiresIn = configuration.GetValue<int>("JwtConfig:TokenValidityMins") * 60,
            };
        }


        public string GenerateJwtToken(ApplicationUser user, string role) // IList<string> roles
        {
            var key = Encoding.UTF8.GetBytes(configuration["JwtConfig:Key"]);
            var tokenValidityMins = configuration.GetValue<int>("JwtConfig:TokenValidityMins");

            // 🟡 استعلام عن userAccount (المستخدم الداخلي)
            var userAccount = dbContext.UserAccounts.FirstOrDefault(u => u.ApplicationUserId == user.Id);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id), // UserId
                //new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName), // JWT معرف فريد للـ 
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""), // بريد المستخدم
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),// اسم المستخدم
                new Claim(ClaimTypes.Role, role),
                new Claim(ClaimTypes.Name, user.FirstName), // user.FirstName بستدعي مباشرة ClaimTypes.Name بس يستدعي ال
                
                // ✅ Full Name
                new Claim("fullName", $"{user.FirstName} {user.LastName}"),

                // ✅ Role Name (مرجع إضافي، لو بدك تستخدمه باسم مختلف)
                new Claim("roleName", role)
            };
            /*
            // ✅ إضافة الأدوار كـ Claims
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            */

            // 🟢 أضف الـ userAccountId إذا لقيته
            if (userAccount != null)
                claims.Add(new Claim("userAccountId", userAccount.Id.ToString()));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(tokenValidityMins),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature),
                Issuer = configuration["JwtConfig:Issuer"],
                Audience = configuration["JwtConfig:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            // Base64 يتم توليد قيمة عشوائية بطول 32 بايت، وتحويلها إلى نص  
            var randomNumber = new byte[32]; // عشوائي عشان الامان
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }


        public string EncryptRefreshToken(string plainText)
        {
            var key = Encoding.UTF8.GetBytes(configuration["JwtConfig:EncryptionKey"]);

            if (key.Length != 32)
                throw new Exception("Encryption key must be 32 bytes long.");

            using var aes = Aes.Create();
            aes.KeySize = 256;
            aes.BlockSize = 128;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = key;
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            var plainBytes = Encoding.UTF8.GetBytes(plainText);
            var encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

            // دمج IV مع البيانات المشفرة
            var result = new byte[aes.IV.Length + encryptedBytes.Length];
            Buffer.BlockCopy(aes.IV, 0, result, 0, aes.IV.Length);
            Buffer.BlockCopy(encryptedBytes, 0, result, aes.IV.Length, encryptedBytes.Length);

            return Convert.ToBase64String(result);
        }

        public string DecryptRefreshToken(string encryptedToken)
        {
            var key = Encoding.UTF8.GetBytes(configuration["JwtConfig:EncryptionKey"]);

            if (key.Length != 32)
                throw new Exception("Encryption key must be 32 bytes long.");

            var fullCipher = Convert.FromBase64String(encryptedToken);

            using var aes = Aes.Create();
            aes.KeySize = 256;
            aes.BlockSize = 128;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = key;

            var ivSize = aes.BlockSize / 8;

            if (fullCipher.Length < ivSize)
                throw new ArgumentException("Invalid encrypted token.");

            var iv = new byte[ivSize];
            var cipherText = new byte[fullCipher.Length - ivSize];

            Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
            Buffer.BlockCopy(fullCipher, ivSize, cipherText, 0, cipherText.Length);

            aes.IV = iv;

            using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

            try
            {
                var decryptedBytes = decryptor.TransformFinalBlock(cipherText, 0, cipherText.Length);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
            catch (CryptographicException ex)
            {
                // طباعة الخطأ لمزيد من الفحص
                Console.WriteLine($"Decryption error: {ex.Message}");
                return null;
            }
        }










        public string ExtractUserIdFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);
            return userIdClaim?.Value;
        }

        public bool ValidateToken(string token) // Access Token بتكون
        {
            var tokenHandler = new JwtSecurityTokenHandler(); // JwtSecurityTokenHandler(): للتحقق من صحة التوكن
            var key = Encoding.UTF8.GetBytes(configuration["JwtConfig:Key"]); // تحتاج هذا النوع SymmetricSecurityKey  الى مصفوفة بايتات لان string ويتم تحويل المفتاح من appsettings.json يتم جلبه من Secret Key

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters // Access Token يتم التحقق من عدة معايير لل
                {
                    ValidateIssuerSigningKey = true, // (Secret Key) تتحقق من أن توقيع التوكن صالح باستخدام المفتاح السري 
                    IssuerSigningKey = new SymmetricSecurityKey(key), // تحدد المفتاح السري الذي تم الحصول عليه مسبقًا للتحقق من صحة توقيع التوكن
                    ValidateIssuer = true, // تحقق من الجهة المصدرة للتوكن
                    ValidIssuer = configuration["JwtConfig:Issuer"], // (JwtConfig:Issuer) الذي أنشأ التوكن هو نفس المرسل الصحيح المحدد في الإعدادات 
                    ValidateAudience = true,
                    ValidAudience = configuration["JwtConfig:Audience"], // هو المستلم الصحيح كما هو معرف في الإعدادات (Audience) تتحقق من أن المستقبل 
                    ValidateLifetime = true, // not before and not expiration time for the Access Token تحقق من صلاحية التوكن الزمنية , اي ان الوقت الحالي يقع بين
                    ClockSkew = TimeSpan.Zero  // عدم السماح بتفاوت في الوقت , عادة ما يكون 5 دقائق , تمنعه
                }, out SecurityToken validatedToken); // validatedToken تخزين التوكن المحقق في 

                return true;
            }
            catch
            {
                // التوكن غير صالح أو انتهت صلاحيته
                return false;
            }
        }


        public TimeSpan GetAccessTokenRemainingTime(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var jwtToken = tokenHandler.ReadJwtToken(token);

                // الحصول على تاريخ انتهاء الصلاحية (exp)
                var expiry = jwtToken.ValidTo;

                // مقارنة تاريخ الانتهاء مع الوقت الحالي
                var remainingTime = expiry - DateTime.UtcNow;

                return remainingTime;
            }
            catch
            {
                // إذا كان التوكن غير صالح أو انتهت صلاحيته
                return TimeSpan.Zero;
            }
        }



    }
}

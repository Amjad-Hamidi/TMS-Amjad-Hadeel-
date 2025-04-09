//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using TMS.API.Models;

//namespace TMS.API.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [Authorize] // تأكد أن جميع العمليات تتطلب تسجيل الدخول
//    public class UserAccountsController : ControllerBase
//    {
//        private readonly UserManager<UserAccount> userManager;
//        private readonly RoleManager<IdentityRole> roleManager;

//        public UserAccountsController(UserManager<UserAccount> userManager, RoleManager<IdentityRole> roleManager)
//        {
//            this.userManager = userManager;
//            this.roleManager = roleManager;
//        }

//        // ✅ عرض جميع المستخدمين
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<UserAccount>>> Get()
//        {
//            var users = await userManager.Users.ToListAsync();
//            return Ok(users);
//        }

//        // ✅ جلب مستخدم عبر ID
//        [HttpGet("{id}")]
//        public async Task<ActionResult<UserAccount>> GetById(string id)
//        {
//            var user = await userManager.FindByIdAsync(id);
//            if (user == null)
//                return NotFound(new { message = "User not found" });

//            return Ok(user);
//        }

//        // ✅ إضافة مستخدم جديد
//        [HttpPost]
//        public async Task<ActionResult<UserAccount>> Create([FromBody] UserAccount userAccount, string password)
//        {
//            if (string.IsNullOrWhiteSpace(userAccount.UserName) || string.IsNullOrWhiteSpace(password))
//                return BadRequest("Invalid data");

//            userAccount.Email = $"{userAccount.UserName}@example.com"; // وضع إيميل افتراضي

//            var result = await userManager.CreateAsync(userAccount, password);
//            if (!result.Succeeded)
//                return BadRequest(result.Errors);

//            return CreatedAtAction(nameof(GetById), new { id = userAccount.Id }, userAccount);
//        }

//        // ✅ تحديث بيانات المستخدم
//        [HttpPut("{id}")]
//        public async Task<ActionResult> Update(string id, [FromBody] UserAccount updatedUser)
//        {
//            var user = await userManager.FindByIdAsync(id);
//            if (user == null)
//                return NotFound("User not found");

//            user.UserName = updatedUser.UserName;
//            user.FullName = updatedUser.FullName;

//            var result = await userManager.UpdateAsync(user);
//            if (!result.Succeeded)
//                return BadRequest(result.Errors);

//            return Ok(user);
//        }

//        // ✅ تغيير كلمة المرور
//        [HttpPut("{id}/change-password")]
//        public async Task<ActionResult> ChangePassword(string id, [FromBody] ChangePasswordModel model)
//        {
//            var user = await userManager.FindByIdAsync(id);
//            if (user == null)
//                return NotFound("User not found");

//            var result = await userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
//            if (!result.Succeeded)
//                return BadRequest(result.Errors);

//            return Ok(new { message = "Password changed successfully" });
//        }

//        // ✅ حذف مستخدم
//        [HttpDelete("{id}")]
//        public async Task<ActionResult> Delete(string id)
//        {
//            var user = await userManager.FindByIdAsync(id);
//            if (user == null)
//                return NotFound("User not found");

//            var result = await userManager.DeleteAsync(user);
//            if (!result.Succeeded)
//                return BadRequest(result.Errors);

//            return NoContent();
//        }
//    }

//    // نموذج تغيير كلمة المرور
//    public class ChangePasswordModel
//    {
//        public string OldPassword { get; set; }
//        public string NewPassword { get; set; }
//    }
//}

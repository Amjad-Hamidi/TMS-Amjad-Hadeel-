namespace TMS.API.Models.AuthenticationModels
{
    public class LoginResponseModel
    {
        public string UserName { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
        public string Role { get; set; }
        public int UserAccountId { get; set; }

    }
}

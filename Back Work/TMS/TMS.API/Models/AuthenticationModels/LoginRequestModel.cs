﻿namespace TMS.API.Models.AuthenticationModels
{
    public class LoginRequestModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; } 
    }
}

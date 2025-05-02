namespace TMS.API.DTOs.Users
{
    public class GetUsersDto
    {
        public int UserAccountId { get; set; }
        public string ApplicationUserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string ProfileImageUrl { get; set; }
        public string Role { get; set; }
        public DateTime BirthDate { get; set; }
    }
}

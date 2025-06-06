using System.Net;
using System.Text.Json;

namespace TMS.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // نفّذ الطلب
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = ex switch
                {
                    ArgumentException => (int)HttpStatusCode.BadRequest, // 400
                    InvalidOperationException => (int)HttpStatusCode.BadRequest, // 400
                    UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized, // 401
                    _ => (int)HttpStatusCode.InternalServerError // 500
                };

                var result = JsonSerializer.Serialize(new
                {
                    status = context.Response.StatusCode,
                    message = ex.Message
                });

                await context.Response.WriteAsync(result);
            }
        }
    }
}

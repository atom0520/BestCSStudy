using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BestCSStudy.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace BestCSStudy.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            
            var userClaim = resultContext.HttpContext.User
            .FindFirst(ClaimTypes.NameIdentifier);

            if(userClaim!=null){
                var userId = int.Parse(userClaim.Value);

                var repo = resultContext.HttpContext.RequestServices.GetService<IAppRepository>();
                var user = await repo.GetUser(userId);

                user.LastActive = DateTime.Now;
                await repo.SaveAll();
            }
          
        }
    }
}
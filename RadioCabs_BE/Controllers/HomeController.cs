using Microsoft.AspNetCore.Mvc;

namespace RadioCabs_BE.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("/")]
        public IActionResult Index()
            => Content("RadioCabs API — OK", "text/plain");
    }
}

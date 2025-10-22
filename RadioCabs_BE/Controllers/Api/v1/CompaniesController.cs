using Microsoft.AspNetCore.Mvc;
using RadioCabs_BE.DTOs;
using RadioCabs_BE.Services.Interfaces;

namespace RadioCabs_BE.Controllers.Api.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyDto>> GetById(long id)
        {
            var company = await _companyService.GetByIdAsync(id);
            if (company == null)
                return NotFound();

            return Ok(company);
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<CompanyDto>>> GetPaged([FromQuery] PageRequest request)
        {
            var result = await _companyService.GetPagedAsync(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<CompanyDto>> Create([FromBody] CreateCompanyDto dto)
        {
            try
            {
                var company = await _companyService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = company.CompanyId }, company);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CompanyDto>> Update(long id, [FromBody] UpdateCompanyDto dto)
        {
            try
            {
                var company = await _companyService.UpdateAsync(id, dto);
                if (company == null)
                    return NotFound();

                return Ok(company);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            var success = await _companyService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}

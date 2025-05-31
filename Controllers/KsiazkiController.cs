using BibliotekaApi.DTOs;
using BibliotekaApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web.Resource;

namespace BibliotekaApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")]
    public class KsiazkiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KsiazkiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<KsiazkaDTO>>> PobierzKsiazki([FromQuery] int? autorId)
        {
            var ksiazkiQuery = _context.Ksiazki.Include(k => k.Autor).AsQueryable();

            if (autorId.HasValue)
            {
                ksiazkiQuery = ksiazkiQuery.Where(k => k.AutorId == autorId);
            }

            var ksiazki = await ksiazkiQuery.Select(k => new KsiazkaDTO
            {
                Id = k.Id,
                Tytul = k.Tytul,
                Rok = k.Rok,
                Autor = new AutorDTO
                {
                    Id = k.Autor.Id,
                    Imie = k.Autor.Imie,
                    Nazwisko = k.Autor.Nazwisko
                }
            }).ToListAsync();

            return Ok(ksiazki);
        }

        [HttpPost]
        public async Task<ActionResult<Ksiazka>> UtworzKsiazke(KsiazkaDTO ksiazkaDto)
        {
            if (string.IsNullOrEmpty(ksiazkaDto.Tytul) || ksiazkaDto.Rok < 0)
            {
                return BadRequest("Nieprawidłowe dane książki.");
            }

            var autor = await _context.Autorzy.FindAsync(ksiazkaDto.Autor.Id);
            if (autor == null)
            {
                return NotFound("Nie znaleziono autora.");
            }

            var ksiazka = new Ksiazka
            {
                Tytul = ksiazkaDto.Tytul,
                Rok = ksiazkaDto.Rok,
                AutorId = autor.Id
            };

            _context.Ksiazki.Add(ksiazka);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PobierzKsiazki), new { id = ksiazka.Id }, ksiazka);
        }
    }
}

using BibliotekaApi.DTOs;
using BibliotekaApi.Models;
using BibliotekaApi;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AutorzyController : ControllerBase
{
    private readonly AppDbContext _context;

    public AutorzyController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AutorDTO>>> PobierzAutorow()
    {
        var autorzy = await _context.Autorzy.Select(a => new AutorDTO
        {
            Id = a.Id,
            Imie = a.Imie,
            Nazwisko = a.Nazwisko
        }).ToListAsync();

        return Ok(autorzy);
    }

    [HttpPost]
    public async Task<ActionResult<Autor>> UtworzAutora(AutorDTO autorDto)
    {
        if (string.IsNullOrEmpty(autorDto.Imie) || string.IsNullOrEmpty(autorDto.Nazwisko))
        {
            return BadRequest("Imię i nazwisko autora nie mogą być puste.");
        }

        var autor = new Autor
        {
            Imie = autorDto.Imie,
            Nazwisko = autorDto.Nazwisko
        };

        _context.Autorzy.Add(autor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(PobierzAutorow), new { id = autor.Id }, autor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> AktualizujAutora(int id, AutorDTO autorDto)
    {
        if (id <= 0 || string.IsNullOrEmpty(autorDto.Imie) || string.IsNullOrEmpty(autorDto.Nazwisko))
        {
            return BadRequest("Nieprawidłowe dane autora.");
        }

        var autor = await _context.Autorzy.FindAsync(id);
        if (autor == null)
        {
            return NotFound("Nie znaleziono autora.");
        }

        autor.Imie = autorDto.Imie;
        autor.Nazwisko = autorDto.Nazwisko;

        _context.Entry(autor).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> UsunAutora(int id)
    {
        var autor = await _context.Autorzy.FindAsync(id);
        if (autor == null)
        {
            return NotFound("Nie znaleziono autora.");
        }

        _context.Autorzy.Remove(autor);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

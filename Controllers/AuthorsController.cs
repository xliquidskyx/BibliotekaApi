using BibliotekaApi.DTOs;
using BibliotekaApi.Models;
using BibliotekaApi;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BibliotekaApi.Controllers
{
    [Route("authors")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthorsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuthorDTO>>> GetAuthors()
        {
            var authors = await _context.Authors
                .Include(a => a.Books)
                .ToListAsync();

            return Ok(authors.Select(a => new AuthorDTO
            {
                Id = a.Id,
                FirstName = a.FirstName,
                LastName = a.LastName,
                Books = a.Books.Select(k => new BookDTO
                {
                    Id = k.Id,
                    Title = k.Title,
                    Year = k.Year,
                    Author = new AuthorDTO
                    {
                        Id = a.Id,
                        FirstName = a.FirstName,
                        LastName = a.LastName
                    },
                    Copies = k.Copies.Select(c => new CopyDTO
                    {
                        Id = c.Id,
                        BookId = c.BookId
                    }).ToList()
                }).ToList()
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuthorDTO>> GetAuthor(int id)
        {
            var author = await _context.Authors
                .Include(a => a.Books)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (author == null)
            {
                return NotFound(new { error = "Author not found" });
            }

            return Ok(new AuthorDTO
            {
                Id = author.Id,
                FirstName = author.FirstName,
                LastName = author.LastName,
                Books = author.Books.Select(k => new BookDTO
                {
                    Id = k.Id,
                    Title = k.Title,
                    Year = k.Year,
                    Author = new AuthorDTO
                    {
                        Id = author.Id,
                        FirstName = author.FirstName,
                        LastName = author.LastName
                    },
                    Copies = k.Copies.Select(c => new CopyDTO
                    {
                        Id = c.Id,
                        BookId = c.BookId
                    }).ToList()
                }).ToList()
            });
        }

        [HttpPost]
        public async Task<ActionResult<AuthorDTO>> CreateAuthor(CreateAuthorDTO createAuthorDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var author = new Author
            {
                FirstName = createAuthorDTO.FirstName,
                LastName = createAuthorDTO.LastName
            };

            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return StatusCode(201, new AuthorDTO
            {
                Id = author.Id,
                FirstName = author.FirstName,
                LastName = author.LastName,
                Books = new List<BookDTO>()
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuthor(int id, CreateAuthorDTO createAuthorDTO)
        {
            if (id <= 0)
            {
                return BadRequest(new { error = "Invalid author ID" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound(new { error = "Author not found" });
            }

            author.FirstName = createAuthorDTO.FirstName;
            author.LastName = createAuthorDTO.LastName;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { error = "Invalid author ID" });
            }

            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound(new { error = "Author not found" });
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

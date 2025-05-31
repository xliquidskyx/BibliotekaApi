using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BibliotekaApi;
using BibliotekaApi.Models;
using BibliotekaApi.DTOs;

namespace BibliotekaApi.Controllers
{
    [ApiController]
    [Route("copies")]
    public class CopiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CopiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CopyDTO>>> GetCopies(int? bookId = null)
        {
            var query = _context.Copies
                .Include(c => c.Book)
                .ThenInclude(b => b.Author)
                .AsQueryable();

            if (bookId.HasValue)
            {
                query = query.Where(c => c.BookId == bookId);
            }

            var copies = await query.ToListAsync();

            return Ok(copies.Select(c => new CopyDTO
            {
                Id = c.Id,
                BookId = c.BookId,
                Book = c.Book == null ? null : new BookDTO
                {
                    Id = c.Book.Id,
                    Title = c.Book.Title,
                    Year = c.Book.Year,
                    Author = c.Book.Author == null ? null : new AuthorDTO
                    {
                        Id = c.Book.Author.Id,
                        FirstName = c.Book.Author.FirstName,
                        LastName = c.Book.Author.LastName
                    }
                }
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CopyDTO>> GetCopy(int id)
        {
            var copy = await _context.Copies
                .Include(c => c.Book)
                .ThenInclude(b => b.Author)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (copy == null)
            {
                return NotFound(new { error = "Copy not found" });
            }

            return Ok(new CopyDTO
            {
                Id = copy.Id,
                BookId = copy.BookId,
                Book = copy.Book == null ? null : new BookDTO
                {
                    Id = copy.Book.Id,
                    Title = copy.Book.Title,
                    Year = copy.Book.Year,
                    Author = copy.Book.Author == null ? null : new AuthorDTO
                    {
                        Id = copy.Book.Author.Id,
                        FirstName = copy.Book.Author.FirstName,
                        LastName = copy.Book.Author.LastName
                    }
                }
            });
        }

        [HttpPost]
        public async Task<ActionResult<CopyDTO>> CreateCopy(CreateCopyDTO createCopyDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = await _context.Books
                .Include(b => b.Author)
                .FirstOrDefaultAsync(b => b.Id == createCopyDTO.BookId);

            if (book == null)
            {
                return BadRequest(new { error = "Book not found" });
            }

            var copy = new Copy
            {
                BookId = createCopyDTO.BookId
            };

            _context.Copies.Add(copy);
            await _context.SaveChangesAsync();

            return StatusCode(201, new CopyDTO
            {
                Id = copy.Id,
                BookId = copy.BookId,
                Book = new BookDTO
                {
                    Id = book.Id,
                    Title = book.Title,
                    Year = book.Year,
                    Author = book.Author == null ? null : new AuthorDTO
                    {
                        Id = book.Author.Id,
                        FirstName = book.Author.FirstName,
                        LastName = book.Author.LastName
                    }
                }
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCopy(int id)
        {
            var copy = await _context.Copies.FindAsync(id);
            if (copy == null)
            {
                return NotFound(new { error = "Copy not found" });
            }

            _context.Copies.Remove(copy);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 
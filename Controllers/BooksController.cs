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
    [Route("books")]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BooksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks(int? authorId = null)
        {
            var query = _context.Books
                .Include(b => b.Author)
                .Include(b => b.Copies)
                .AsQueryable();

            if (authorId.HasValue)
            {
                query = query.Where(b => b.AuthorId == authorId);
            }

            var books = await query.ToListAsync();

            return Ok(books.Select(b => new BookDTO
            {
                Id = b.Id,
                Title = b.Title,
                Year = b.Year,
                Author = new AuthorDTO
                {
                    Id = b.Author.Id,
                    FirstName = b.Author.FirstName,
                    LastName = b.Author.LastName
                },
                Copies = b.Copies.Select(c => new CopyDTO
                {
                    Id = c.Id,
                    BookId = c.BookId
                }).ToList()
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDTO>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.Copies)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound(new { error = "Book not found" });
            }

            return Ok(new BookDTO
            {
                Id = book.Id,
                Title = book.Title,
                Year = book.Year,
                Author = new AuthorDTO
                {
                    Id = book.Author.Id,
                    FirstName = book.Author.FirstName,
                    LastName = book.Author.LastName
                },
                Copies = book.Copies.Select(c => new CopyDTO
                {
                    Id = c.Id,
                    BookId = c.BookId
                }).ToList()
            });
        }

        [HttpPost]
        public async Task<ActionResult<BookDTO>> CreateBook(CreateBookDTO createBookDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var author = await _context.Authors.FindAsync(createBookDTO.AuthorId);
            if (author == null)
            {
                return BadRequest(new { error = "Author not found" });
            }

            var book = new Book
            {
                Title = createBookDTO.Title,
                Year = createBookDTO.Year,
                AuthorId = createBookDTO.AuthorId
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return StatusCode(201, new BookDTO
            {
                Id = book.Id,
                Title = book.Title,
                Year = book.Year,
                Author = new AuthorDTO
                {
                    Id = author.Id,
                    FirstName = author.FirstName,
                    LastName = author.LastName
                },
                Copies = new List<CopyDTO>()
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, CreateBookDTO createBookDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { error = "Book not found" });
            }

            var author = await _context.Authors.FindAsync(createBookDTO.AuthorId);
            if (author == null)
            {
                return BadRequest(new { error = "Author not found" });
            }

            book.Title = createBookDTO.Title;
            book.Year = createBookDTO.Year;
            book.AuthorId = createBookDTO.AuthorId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { error = "Book not found" });
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

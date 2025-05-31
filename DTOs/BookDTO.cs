using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BibliotekaApi.DTOs
{
    public class BookDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;

        [Range(1800, 2100, ErrorMessage = "Year must be between 1800 and 2100")]
        public int Year { get; set; }

        public AuthorDTO? Author { get; set; }

        public List<CopyDTO> Copies { get; set; } = new();
    }

    public class CreateBookDTO
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;

        [Range(1800, 2100, ErrorMessage = "Year must be between 1800 and 2100")]
        public int Year { get; set; }

        [Required(ErrorMessage = "Author ID is required")]
        public int AuthorId { get; set; }
    }
}

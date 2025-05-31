using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BibliotekaApi.DTOs
{
    public class CopyDTO
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public BookDTO? Book { get; set; }
    }

    public class CreateCopyDTO
    {
        [Required(ErrorMessage = "Book ID is required")]
        public int BookId { get; set; }
    }
} 
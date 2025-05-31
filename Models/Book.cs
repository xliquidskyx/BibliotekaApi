using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace BibliotekaApi.Models
{
    public class Book
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Range(0, int.MaxValue)]
        public int Year { get; set; }
        public int AuthorId { get; set; }
        public Author Author { get; set; } = null!;
        public ICollection<Copy> Copies { get; set; } = new List<Copy>();
    }
}

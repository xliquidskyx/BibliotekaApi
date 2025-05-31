using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace BibliotekaApi.Models
{

    public class Author
    {
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        public List<Book> Books { get; set; } = new();
    }

}

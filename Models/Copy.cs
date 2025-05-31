using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace BibliotekaApi.Models
{
    public class Copy
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public Book? Book { get; set; }
    }
}

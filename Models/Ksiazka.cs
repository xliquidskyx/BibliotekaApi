using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace BibliotekaApi.Models
{
    public class Ksiazka
    {
        public int Id { get; set; }
        [Required]
        public string Tytul { get; set; }
        [Range(0, int.MaxValue)]
        public int Rok { get; set; }
        public int AutorId { get; set; }
        public Autor Autor { get; set; }
        public List<Kopia> Kopie { get; set; } = new();
    }

}

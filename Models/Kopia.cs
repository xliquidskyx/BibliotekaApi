using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace BibliotekaApi.Models
{
    public class Kopia {
        public int Id { get; set; }
        public int KsiazkaId { get; set; }
        public Ksiazka Ksiazka { get; set; }
    }
}

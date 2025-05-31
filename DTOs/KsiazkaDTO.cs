namespace BibliotekaApi.DTOs
{
    public class KsiazkaDTO
    {
        public int Id { get; set; }
        public string Tytul { get; set; }
        public int Rok { get; set; }
        public AutorDTO Autor { get; set; }
    }
}

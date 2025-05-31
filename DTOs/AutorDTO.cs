namespace BibliotekaApi.DTOs
{
    public class AutorDTO
    {
        public int Id { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("first_name")]
        public string Imie { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("last_name")]
        public string Nazwisko { get; set; }
    }
}

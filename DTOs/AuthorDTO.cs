using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BibliotekaApi.DTOs
{
    public class AuthorDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "First name is required")]
        [JsonPropertyName("first_name")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [JsonPropertyName("last_name")]
        public string LastName { get; set; } = string.Empty;

        public List<BookDTO> Books { get; set; } = new();
    }

    public class CreateAuthorDTO
    {
        [Required(ErrorMessage = "First name is required")]
        [JsonPropertyName("first_name")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [JsonPropertyName("last_name")]
        public string LastName { get; set; } = string.Empty;
    }
}
